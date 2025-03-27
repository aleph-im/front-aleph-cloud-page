import { Buffer } from 'buffer'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import {
  BaseExecutableContent,
  CostEstimationMachineVolume,
  HostRequirements,
  MachineResources,
  MachineVolume,
  MessageCost,
  MessageCostLine,
  MessageCostType,
  Payment,
  PaymentType,
  PaymentType as SDKPaymentType,
  VolumePersistence,
} from '@aleph-sdk/message'
import {
  AddExistingVolume,
  AddPersistentVolume,
  mockVolumeMountPath,
  mockVolumeName,
  mockVolumeRef,
  VolumeManager,
  VolumeType,
} from './volume'
import { Account } from '@aleph-sdk/account'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { NewVolumeField, VolumeField } from '@/hooks/form/useAddVolume'
import { DomainField } from '@/hooks/form/useAddDomains'
import { Domain, DomainManager } from './domain'
import {
  CheckoutStepType,
  EntityType,
  EntityTypeName,
  PaymentMethod,
} from '@/helpers/constants'
import { StreamDurationField } from '@/hooks/form/useSelectStreamDuration'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import Err from '@/helpers/errors'
import { BlockchainId } from './connect/base'
import { CRN, NodeManager } from './node'
import { subscribeSocketFeed } from '@/helpers/socket'
import { convertByteUnits, humanReadableSize, sleep } from '@aleph-front/core'
import { SuperfluidAccount } from '@aleph-sdk/superfluid'
import { isBlockchainPAYGCompatible } from './blockchain'
import { CostLine } from './cost'

export type HoldPaymentConfiguration = {
  chain: BlockchainId
  type: PaymentMethod.Hold
}

export type StreamPaymentConfiguration = {
  chain: BlockchainId
  type: PaymentMethod.Stream
  sender: string
  receiver: string
  streamCost: number
  streamDuration: StreamDurationField
}

export type PaymentConfiguration =
  | HoldPaymentConfiguration
  | StreamPaymentConfiguration

export type Executable = BaseExecutableContent & {
  type: EntityType.Instance | EntityType.GpuInstance | EntityType.Program
  id: string // hash
  payment?: BaseExecutableContent['payment']
  //@todo: Add `trusted_execution` field in FunctionEnvironment in ts sdk
  environment?: any
  //@todo: Add `hash` field in NodeRequirements in ts sdk
  requirements?: any
}

export type ExecutableSchedulerAllocation = {
  vm_hash: string
  vm_type: EntityType.Instance | EntityType.Program
  vm_ipv6: string
  period: {
    start_timestamp: string
    duration_seconds: number
  }
  node: {
    node_id: string
    url: string
    ipv6: string
    supports_ipv6: boolean
  }
}

export type ExecutableStatus = {
  hash: string
  ipv4: string
  ipv6: string
  ipv6Parsed: string
  node: CRN
}

// -----------------------------------------

export type KeyOpsType = 'sign' | 'verify'

export type SignedPublicKeyHeader = {
  payload: string
  signature: string
}

export type ExecutableOperations = 'reboot' | 'expire' | 'erase' | 'stop'

export type KeyPair = {
  publicKey: JsonWebKey
  privateKey: JsonWebKey
  createdAt: number
}

export type AuthPubKeyToken = {
  pubKeyHeader: SignedPublicKeyHeader
  keyPair: KeyPair
}

export const KEYPAIR_TTL = 1000 * 60 * 60 * 2

export type ExecutableCostProps = (
  | {
      type: EntityType.Instance | EntityType.GpuInstance
      rootfs?: {
        size_mib?: number
      }
    }
  | {
      type: EntityType.Program
      isPersistent: boolean
    }
) & {
  resources?: Partial<MachineResources>
  domains?: Domain[]
  volumes?: CostEstimationMachineVolume[]
}

export type StreamPaymentDetail = {
  sender: string
  receiver: string
  flow: number
}
export type StreamPaymentDetails = {
  blockchain: BlockchainId
  streams: StreamPaymentDetail[]
}

export abstract class ExecutableManager<T extends Executable> {
  protected static cachedPubKeyToken?: AuthPubKeyToken

  constructor(
    protected account: Account | undefined,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
    protected nodeManager: NodeManager,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
  ) {}

  abstract getDelSteps(
    executableOrIds: string | T | (string | T)[],
  ): Promise<CheckoutStepType[]>

  abstract delSteps(
    executableOrIds: string | T | (string | T)[],
    account?: SuperfluidAccount,
  ): AsyncGenerator<void>

  abstract getStreamPaymentDetails(
    executableOrIds: string | T | (string | T)[],
    account?: Account,
  ): Promise<StreamPaymentDetails | undefined>

  async checkStatus(executable: T): Promise<ExecutableStatus | undefined> {
    const node = await this.getAllocationCRN(executable)
    if (!node) return

    const { address } = node
    if (!address) throw Err.InvalidCRNAddress

    const nodeUrl = NodeManager.normalizeUrl(address)

    const query = await fetch(`${nodeUrl}/about/executions/list`)
    const response = await query.json()

    const hash = executable.id
    const status = response[hash]
    if (!status) return

    const networking = status['networking']
    if (!networking) return

    const { ipv4, ipv6 } = networking

    return {
      hash,
      ipv4,
      ipv6,
      ipv6Parsed: this.formatVMIPv6Address(ipv6),
      node,
    }
  }

  async getAllocationCRN(executable: T): Promise<CRN | undefined> {
    if (executable.payment?.type === PaymentType.superfluid) {
      const { receiver } = executable.payment
      if (!receiver) return

      const nodes = await this.nodeManager.getCRNNodes()
      const node = nodes.find((node) => node.stream_reward === receiver)

      return node
    }

    const query = await fetch(
      `https://scheduler.api.aleph.sh/api/v0/allocation/${executable.id}`,
    )

    if (query.status === 404) return

    const response = (await query.json()) as ExecutableSchedulerAllocation

    const { node_id, url } = response.node

    const nodes = await this.nodeManager.getCRNNodes()

    const node = nodes.find(
      (node) =>
        node.address &&
        NodeManager.normalizeUrl(node.address) ===
          NodeManager.normalizeUrl(url),
    )

    if (node) return node

    return {
      hash: node_id,
      owner: '',
      reward: '',
      locked: false,
      time: 0,
      score: 0,
      score_updated: true,
      decentralization: 0,
      performance: 0,
      address: url,
      status: 'linked',
      parent: null,
      type: 'compute',
    }
  }

  async notifyCRNAllocation(
    node: CRN,
    instanceId: string,
    retry = true,
  ): Promise<void> {
    if (!node.address) throw Err.InvalidCRNAddress

    let errorMsg = ''

    for (let i = 0; i < 5; i++) {
      try {
        const nodeUrl = NodeManager.normalizeUrl(node.address)

        const req = await fetch(`${nodeUrl}/control/allocation/notify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instance: instanceId,
          }),
        })
        const resp = await req.json()
        if (resp.success) return

        errorMsg = resp.errors[instanceId]
      } catch (e) {
        errorMsg = (e as Error).message
      } finally {
        if (!retry) break
        await sleep(1000)
      }
    }

    throw Err.InstanceStartupFailed(node.hash, errorMsg)
  }

  async getKeyPair(): Promise<KeyPair> {
    const kp = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify'],
    )

    const publicKey = await crypto.subtle.exportKey('jwk', kp.publicKey)
    const privateKey = await crypto.subtle.exportKey('jwk', kp.privateKey)
    const createdAt = Date.now()

    return { publicKey, privateKey, createdAt }
  }

  async getAuthPubKeyToken(
    keyPair?: KeyPair,
    domain?: string,
  ): Promise<AuthPubKeyToken> {
    if (!this.account) throw Err.InvalidAccount

    // @todo: Improve this by caching on local storage
    const { cachedPubKeyToken } = ExecutableManager

    if (cachedPubKeyToken) {
      const { payload } = cachedPubKeyToken.pubKeyHeader
      const parsedPayload = Buffer.from(payload, 'hex').toString('utf-8')
      const { expires, chain } = JSON.parse(parsedPayload)

      const expireTimestamp = new Date(expires).valueOf()

      if (chain === this.account.getChain() && expireTimestamp >= Date.now()) {
        return cachedPubKeyToken
      } else {
        ExecutableManager.cachedPubKeyToken = undefined
      }
    }

    keyPair = keyPair || (await this.getKeyPair())

    const { publicKey, createdAt } = keyPair
    const { address } = this.account

    // @todo: Quickfix that should be moved to the backend
    const expires = new Date(createdAt + KEYPAIR_TTL).toISOString()

    const { kty, crv, x, y } = publicKey
    const currentChain = this.account.getChain()

    const rawPayload = {
      alg: 'ECDSA',
      pubkey: { kty, crv, x, y },
      address,
      domain,
      chain:
        currentChain === BlockchainId.SOL ? BlockchainId.SOL : BlockchainId.ETH,
      expires,
    }

    // Sign message using wallet provider
    let signature
    const payload = Buffer.from(JSON.stringify(rawPayload)).toString('hex')

    if (currentChain === BlockchainId.SOL) {
      const wallet = (this.account as any).wallet
      const encodedMessage = new TextEncoder().encode(payload)

      const signedMessage = await wallet.request({
        method: 'signMessage',
        params: { message: encodedMessage, display: 'hex' },
      })

      signature = Buffer.from(signedMessage.signature).toString('hex')
    } else {
      const wallet = (this.account as any).wallet.provider.provider

      signature = await wallet.request({
        method: 'personal_sign',
        params: [payload, address],
      })
    }

    const pubKeyToken = {
      keyPair,
      pubKeyHeader: {
        payload,
        signature,
      },
    }

    ExecutableManager.cachedPubKeyToken = pubKeyToken

    return pubKeyToken
  }

  async sendPostOperation({
    hostname,
    operation,
    vmId,
  }: {
    operation: ExecutableOperations
    vmId: string
    hostname: string
  }): Promise<Response> {
    const { keyPair, pubKeyHeader } = await this.getAuthPubKeyToken()

    const url = new URL(hostname + '/control/machine/' + vmId + '/' + operation)
    const { hostname: domain, pathname: path } = url

    const signedOperationToken = await this.getAuthOperationToken(
      keyPair.privateKey,
      domain,
      path,
    )

    return fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SignedOperation': JSON.stringify(signedOperationToken),
        'X-SignedPubKey': JSON.stringify(pubKeyHeader),
      },
      mode: 'cors',
    })
  }

  async *subscribeLogs({
    hostname,
    vmId,
    abort,
  }: {
    vmId: string
    hostname: string
    abort: Promise<void>
  }): AsyncGenerator<{ type: string; message: string }> {
    const url = new URL(
      hostname.replace('https://', 'wss://') +
        '/control/machine/' +
        vmId +
        '/stream_logs',
    )

    const { hostname: domain, pathname: path } = url

    const { keyPair, pubKeyHeader } = await this.getAuthPubKeyToken(
      undefined,
      domain,
    )

    const signedOperationToken = await this.getAuthOperationToken(
      keyPair.privateKey,
      domain,
      path,
    )

    const feed = subscribeSocketFeed<any>(url.toString(), abort)

    try {
      const { value: ws } = await feed.next()

      ws.send(
        JSON.stringify({
          auth: {
            'X-SignedOperation': signedOperationToken,
            'X-SignedPubKey': pubKeyHeader,
          },
        }),
      )
    } catch (e) {
      console.error(e)
    }

    let auth = false

    for await (const data of feed) {
      try {
        if (!auth) {
          if (data.status !== 'connected') throw new Error('WS auth')
          auth = true
          continue
        }

        yield data
      } catch (err) {
        console.error(err)
      }
    }
  }

  protected async getAuthOperationToken(
    privateKey: JsonWebKey,
    domain: string,
    path: string,
  ) {
    const encoder = new TextEncoder()

    // @todo: Quickfix that should be moved to the backend
    const [d] = new Date().toISOString().split('Z')
    const time = `${d}+00:00`

    const payload = encoder.encode(
      JSON.stringify({
        time,
        path,
        domain,
        method: 'POST',
      }),
    )

    const importedKey = await crypto.subtle.importKey(
      'jwk',
      privateKey,
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign'],
    )

    const signature = await crypto.subtle.sign(
      { name: 'ECDSA', hash: { name: 'SHA-256' } },
      importedKey,
      payload,
    )

    return {
      payload: Buffer.from(payload).toString('hex'),
      signature: Buffer.from(signature).toString('hex'),
    }
  }

  protected formatVMIPv6Address(ipv6: string): string {
    // Replace the trailing slash and number
    let newIpv6 = ipv6.replace(/\/\d+$/, '')
    // Replace the last '0' of the IPv6 address with '1'
    newIpv6 = newIpv6.replace(/0(?!.*0)/, '1')
    return newIpv6
  }

  protected parseEnvVars(
    envVars?: EnvVarField[],
  ): Record<string, string> | undefined {
    if (!envVars || envVars.length === 0) return
    return Object.fromEntries(envVars.map(({ name, value }) => [name, value]))
  }

  protected async *parseDomainsSteps(
    ref: string,
    domains?: Omit<DomainField, 'ref'>[],
  ): AsyncGenerator<void, Domain[], void> {
    if (!domains || domains.length === 0) return []

    const parsedDomains = domains.map((domain) => ({
      ...domain,
      ref,
    }))

    return yield* this.domainManager.addSteps(parsedDomains, 'ignore')
  }

  protected async parseVolumesForCostEstimation(
    volumes?: VolumeField | VolumeField[],
  ): Promise<MachineVolume[] | undefined> {
    if (!volumes) return

    volumes = Array.isArray(volumes) ? volumes : [volumes]
    if (volumes.length === 0) return

    return await Promise.all(
      volumes.map(async (volume) => {
        switch (volume.volumeType) {
          case VolumeType.New: {
            const vol = volume as NewVolumeField
            const estimated_size_mib = await VolumeManager.getVolumeSize(volume)

            return {
              ref: mockVolumeRef,
              use_latest: vol.useLatest || false,
              mount: vol.mountPath || mockVolumeMountPath,
              estimated_size_mib,
            }
          }
          case VolumeType.Existing: {
            const estimated_size_mib = await VolumeManager.getVolumeSize(volume)

            return {
              ref: volume.refHash || mockVolumeRef,
              use_latest: volume.useLatest || false,
              mount: volume.mountPath || mockVolumeMountPath,
              estimated_size_mib,
            }
          }
          case VolumeType.Persistent: {
            return {
              persistence: VolumePersistence.host,
              name: volume.name || mockVolumeName,
              mount: volume.mountPath || mockVolumeMountPath,
              size_mib: volume.size || 0,
            }
          }
        }
      }),
    )
  }

  protected async *parseVolumesSteps(
    volumes?: VolumeField | VolumeField[],
  ): AsyncGenerator<void, MachineVolume[] | undefined, void> {
    if (!volumes) return

    volumes = Array.isArray(volumes) ? volumes : [volumes]
    if (volumes.length === 0) return

    // @note: Create new volumes before and cast them to ExistingVolume type
    const messages = yield* this.volumeManager.addSteps(volumes)

    const parsedVolumes: (AddExistingVolume | AddPersistentVolume)[] =
      await Promise.all(
        volumes.map(async (volume, i) => {
          if (volume.volumeType !== VolumeType.New) return volume

          const refHash = messages[i]?.id || mockVolumeRef
          const estimated_size_mib = await VolumeManager.getVolumeSize(volume)

          return {
            ...volume,
            volumeType: VolumeType.Existing,
            refHash,
            estimated_size_mib,
          } as AddExistingVolume
        }),
      )

    return parsedVolumes.map((volume) => {
      if (volume.volumeType === VolumeType.Persistent) {
        const { mountPath: mount, size: size_mib, name } = volume

        return {
          persistence: VolumePersistence.host,
          mount,
          size_mib,
          name,
        }
      }

      const {
        refHash: ref,
        mountPath: mount,
        useLatest: use_latest = false,
        estimated_size_mib,
      } = volume
      return { mount, ref, use_latest, estimated_size_mib }
    }) as MachineVolume[]
  }

  protected parseSpecs(
    specs: InstanceSpecsField,
  ): Omit<MachineResources, 'seconds'> | undefined {
    if (!specs) return

    return {
      vcpus: specs.cpu,
      memory: specs.ram,
    }
  }

  protected parseMetadata(
    name = 'Untitled',
    tags?: string[],
    metadata?: Record<string, unknown>,
  ): Record<string, unknown> {
    const out: Record<string, unknown> = { name }

    if (tags && tags.length > 0) {
      out.tags = tags
    }

    return {
      ...metadata,
      ...out,
    }
  }

  protected parsePaymentForCostEstimation(
    payment?: PaymentConfiguration,
  ): Payment {
    if (payment?.type === PaymentMethod.Stream) {
      return {
        chain: payment.chain,
        type: SDKPaymentType.superfluid,
        receiver: payment.receiver,
      }
    } else {
      return {
        chain: payment?.chain || BlockchainId.ETH,
        type: SDKPaymentType.hold,
      }
    }
  }

  protected parsePayment(payment?: PaymentConfiguration): Payment {
    if (!payment)
      return {
        chain: BlockchainId.ETH,
        type: SDKPaymentType.hold,
      }
    if (payment.type === PaymentMethod.Stream) {
      if (!payment.receiver) throw Err.ReceivedRequired
      if (isBlockchainPAYGCompatible(payment.chain))
        return {
          chain: payment.chain,
          type: SDKPaymentType.superfluid,
          receiver: payment.receiver,
        }
      throw Err.StreamNotSupported
    }
    return {
      chain: payment.chain,
      type: SDKPaymentType.hold,
    }
  }

  protected parseRequirements(node?: CRN): HostRequirements | undefined {
    if (!node || !node.hash) return

    const requirements = {
      node: {
        node_hash: node.hash,
      },
    } as HostRequirements

    if (node.terms_and_conditions)
      requirements.node = {
        ...requirements.node,
        terms_and_conditions: node.terms_and_conditions,
      }

    return requirements
  }

  protected getExecutableCostLines(
    entityProps: ExecutableCostProps,
    costs: MessageCost,
  ): CostLine[] {
    if (!costs) return []

    const detailMap = costs.detail.reduce(
      (ac, cv) => {
        ac[cv.type] = cv
        return ac
      },
      {} as Record<MessageCostType, MessageCostLine>,
    )

    // Execution

    const { vcpus: cpu = 0, memory: ram = 0 } = entityProps.resources || {}

    const cpuStr = `${cpu}x86-64bit`

    const ramStr = `.${convertByteUnits(ram, {
      from: 'MiB',
      to: 'GiB',
      displayUnit: false,
    })}GB-RAM`

    const rootfsVolume =
      detailMap[MessageCostType.EXECUTION_INSTANCE_VOLUME_ROOTFS]

    // Use the actual system volume size from rootfs
    const storage = rootfsVolume ? entityProps.rootfs.size_mib : undefined

    // For VM instances, display the full storage size in detail for now
    // We'll adjust this later after we calculate the discount
    let displayStorage = storage

    const storageStr = !displayStorage
      ? ''
      : `.${convertByteUnits(displayStorage, {
          from: 'MiB',
          to: 'GiB',
          displayUnit: false,
        })}GB-HDD`

    const detail = `${cpuStr}${ramStr}${storageStr}`

    const paymentMethod =
      costs.payment_type === PaymentType.hold
        ? PaymentMethod.Hold
        : PaymentMethod.Stream

    const costProp =
      paymentMethod === PaymentMethod.Hold ? 'cost_hold' : 'cost_stream'

    // Calculate the base execution cost
    const baseExecutionCost = Number(
      detailMap[MessageCostType.EXECUTION][costProp],
    )
    let totalExecutionCost = baseExecutionCost

    // Check if volume discount exists
    const volumeDiscount = detailMap[MessageCostType.EXECUTION_VOLUME_DISCOUNT]
    // Make sure the discount amount is positive (original amount is negative)
    const discountAmount = volumeDiscount
      ? Math.abs(Number(volumeDiscount[costProp]))
      : 0

    // For instances and GPU instances, handle the rootfs volume and apply discount
    if (
      entityProps.type === EntityType.Instance ||
      entityProps.type === EntityType.GpuInstance
    ) {
      // If we have a rootfs volume cost
      if (rootfsVolume) {
        const rootfsCost = Number(rootfsVolume[costProp])

        // For VM instances, add the rootfs cost to the execution cost and apply discount
        totalExecutionCost += rootfsCost

        // Apply the discount to the execution cost
        if (volumeDiscount) {
          totalExecutionCost -= discountAmount

          // Now that we have the discount, adjust the display storage size to show in detail
          if (storage) {
            // Calculate the discounted storage based on the cost percentage
            // Use the percentage that is covered by the discount
            const percentCovered = Math.min(1, discountAmount / rootfsCost) // Cap at 100%
            displayStorage = Math.ceil(storage * percentCovered)
          }
        }
      }
    }

    // Create the execution line with the adjusted cost
    const executionLines: CostLine[] = [
      {
        id: MessageCostType.EXECUTION,
        name: EntityTypeName[entityProps.type].toUpperCase(),
        detail,
        cost: this.parseCost(paymentMethod, totalExecutionCost),
      },
    ]

    // For instances and GPU instances, add extra storage line if needed
    if (
      (entityProps.type === EntityType.Instance ||
        entityProps.type === EntityType.GpuInstance) &&
      rootfsVolume
    ) {
      const rootfsCost = Number(rootfsVolume[costProp])
      if (rootfsCost > discountAmount) {
        // Calculate the extra storage size based on cost percentage
        const totalStorage = storage || 0

        // If we know the total cost and discount, we can calculate
        // the percentage of the storage that's covered by the discount
        const percentCovered = discountAmount / rootfsCost
        const discountedStorage = Math.floor(totalStorage * percentCovered)
        const extraStorage = totalStorage - discountedStorage

        // Calculate the cost for just this extra storage
        const extraStorageCost = rootfsCost - discountAmount

        // Only add the extra line if there's actual extra storage
        if (extraStorage > 0) {
          executionLines.push({
            id: MessageCostType.EXECUTION_INSTANCE_VOLUME_ROOTFS,
            name: 'STORAGE',
            label: 'SYSTEM',
            detail: humanReadableSize(extraStorage, 'MiB'),
            cost: this.parseCost(paymentMethod, extraStorageCost),
          })
        }
      }
    }
    // For programs, we don't apply discount to execution cost
    // The discount will be applied to attached volumes in the volumesLines section

    // Volumes

    const volumesMap = (entityProps.volumes || []).reduce(
      (ac, cv) => {
        ac[cv.mount] = cv
        return ac
      },
      {} as Record<string, CostEstimationMachineVolume>,
    )

    // For programs, apply the discount to volumes
    let remainingDiscount =
      entityProps.type === EntityType.Program ? discountAmount : 0

    const volumesLines: CostLine[] = costs.detail
      .filter(
        (detail) =>
          detail.type === MessageCostType.EXECUTION_VOLUME_INMUTABLE ||
          detail.type === MessageCostType.EXECUTION_VOLUME_PERSISTENT,
      )
      .map((detail) => {
        const [, mount] = detail.name.split(':')
        const vol = volumesMap[mount]
        const size = 'size_mib' in vol ? vol.size_mib : vol.estimated_size_mib
        const label = 'size_mib' in vol ? 'PERSISTENT' : 'VOLUME'

        let volumeCost = Number(detail[costProp])

        // Apply discount for programs
        if (entityProps.type === EntityType.Program && remainingDiscount > 0) {
          // If the discount is larger than the volume cost, apply the whole volume cost as discount
          if (remainingDiscount >= volumeCost) {
            remainingDiscount -= volumeCost
            volumeCost = 0
          } else {
            // Otherwise, apply partial discount
            volumeCost -= remainingDiscount
            remainingDiscount = 0
          }
        }

        return {
          id: `${detail.type}|${detail.name}`,
          name: 'STORAGE',
          label,
          detail: humanReadableSize(size, 'MiB'),
          cost: this.parseCost(paymentMethod, volumeCost),
        }
      })

    // Persistent

    const programTypeLines: CostLine[] =
      entityProps.type === EntityType.Program
        ? [
            {
              id: 'PROGRAM_TYPE',
              name: 'TYPE',
              detail: entityProps.isPersistent ? 'persistent' : 'on-demand',
              cost: this.parseCost(paymentMethod, 0),
            },
          ]
        : []

    // Domains

    const domainsLines: CostLine[] = (entityProps.domains || []).map(
      (domain) => ({
        id: 'DOMAIN',
        name: 'CUSTOM DOMAIN',
        detail: domain.name,
        cost: this.parseCost(paymentMethod, 0),
      }),
    )

    return [
      ...executionLines,
      ...volumesLines,
      ...programTypeLines,
      ...domainsLines,
    ]
  }

  protected parseCost(
    paymentMethod: PaymentMethod | PaymentType,
    cost: number,
  ) {
    return paymentMethod === PaymentMethod.Hold ? cost : cost * 3600
  }
}
