import { Buffer } from 'buffer'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import {
  BaseExecutableContent,
  CostEstimationMachineVolume,
  HostRequirements,
  MachineResources,
  MachineVolume,
  MAXIMUM_DISK_SIZE,
  MessageCost,
  MessageCostLine,
  MessageCostType,
  Payment,
  PaymentType,
  PaymentType as SDKPaymentType,
} from '@aleph-sdk/message'
import {
  AddExistingVolume,
  AddPersistentVolume,
  mockVolumeRef,
  VolumeManager,
  VolumeType,
} from './volume'
import { Account } from '@aleph-sdk/account'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { VolumeField } from '@/hooks/form/useAddVolume'
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

export type Executable = {
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

export abstract class ExecutableManager<T extends Executable> {
  protected static cachedPubKeyToken?: AuthPubKeyToken

  constructor(
    protected account: Account,
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

  protected async *parseVolumesSteps(
    volumes?: VolumeField | VolumeField[],
    estimateCost?: boolean,
  ): AsyncGenerator<void, MachineVolume[] | undefined, void> {
    if (!volumes) return

    volumes = Array.isArray(volumes) ? volumes : [volumes]
    if (volumes.length === 0) return

    // @note: Create new volumes before and cast them to ExistingVolume type
    console.log('estimateCost', estimateCost)
    const messages = !estimateCost
      ? yield* this.volumeManager.addSteps(volumes)
      : []

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
          persistence: 'host',
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
    const storage = rootfsVolume
      ? ram * 10 > MAXIMUM_DISK_SIZE
        ? MAXIMUM_DISK_SIZE
        : ram * 10
      : undefined

    const storageStr = !storage
      ? ''
      : `.${convertByteUnits(storage, {
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

    const executionLines = [
      {
        id: MessageCostType.EXECUTION,
        name: EntityTypeName[entityProps.type].toUpperCase(),
        detail,
        cost: this.parseCost(
          paymentMethod,
          Number(detailMap[MessageCostType.EXECUTION][costProp]),
        ),
      },
    ]

    // Volumes

    const volumesMap = (entityProps.volumes || []).reduce(
      (ac, cv) => {
        ac[cv.mount] = cv
        return ac
      },
      {} as Record<string, CostEstimationMachineVolume>,
    )

    const volumesLines = costs.detail
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

        return {
          id: `${detail.type}|${detail.name}`,
          name: 'STORAGE',
          label,
          detail: humanReadableSize(size, 'MiB'),
          cost: this.parseCost(paymentMethod, Number(detail[costProp])),
        }
      })

    // Persistent

    const programTypeLines =
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

    const domainsLines = (entityProps.domains || []).map((domain) => ({
      id: 'DOMAIN',
      name: 'CUSTOM DOMAIN',
      detail: domain.name,
      cost: this.parseCost(paymentMethod, 0),
    }))

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
