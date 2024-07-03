import { Buffer } from 'buffer'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import {
  BaseExecutableContent,
  MachineResources,
  MachineVolume,
  Payment,
  PaymentType,
  PaymentType as SDKPaymentType,
} from '@aleph-sdk/message'
import {
  AddExistingVolume,
  AddPersistentVolume,
  VolumeCost,
  VolumeCostProps,
  VolumeManager,
  VolumeType,
} from './volume'
import { Account } from '@aleph-sdk/account'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { DomainField } from '@/hooks/form/useAddDomains'
import { Domain, DomainManager } from './domain'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import {
  getHours,
  StreamDurationField,
} from '@/hooks/form/useSelectStreamDuration'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import Err from '@/helpers/errors'
import { BlockchainId } from './connect/base'
import { CRN, NodeManager } from './node'
import { subscribeSocketFeed } from '@/helpers/socket'

type ExecutableCapabilitiesProps = {
  internetAccess?: boolean
  blockchainRPC?: boolean
  enableSnapshots?: boolean
}

export type ExecutableCostProps = VolumeCostProps & {
  type: EntityType.Instance | EntityType.Program
  isPersistent?: boolean
  paymentMethod?: PaymentMethod
  specs?: InstanceSpecsField
  capabilities?: ExecutableCapabilitiesProps
  streamDuration?: StreamDurationField
}

export type ExecutableCost = Omit<VolumeCost, 'totalCost'> & {
  computeTotalCost: number
  volumeTotalCost: number
  totalCost: number
  totalStreamCost: number
}

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
  type: EntityType.Instance | EntityType.Program
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
  type: EntityType.Instance | EntityType.Program
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

export const KEYPAIR_TTL = 1000 * 60 * 60 * 2

export abstract class ExecutableManager {
  /**
   * Calculates the amount of tokens required to deploy a function
   * https://medium.com/aleph-im/aleph-im-tokenomics-update-nov-2022-fd1027762d99
   */
  static async getExecutableCost({
    type,
    isPersistent,
    specs,
    streamDuration = {
      duration: 1,
      unit: 'h',
    },
    paymentMethod = PaymentMethod.Hold,
    capabilities = {},
    volumes = [],
  }: ExecutableCostProps): Promise<ExecutableCost> {
    if (!specs)
      return {
        computeTotalCost: 0,
        volumeTotalCost: 0,
        perVolumeCost: [],
        totalCost: 0,
        totalStreamCost: 0,
      }

    isPersistent = type === EntityType.Instance ? true : isPersistent

    const basePrice =
      paymentMethod === PaymentMethod.Hold ? (isPersistent ? 2_000 : 200) : 0.11

    const capabilitiesCost = Object.values(capabilities).reduce(
      (ac, cv) => ac + Number(cv),
      1, // @note: baseAlephAPI always included,
    )

    const computeTotalCost = basePrice * specs.cpu * capabilitiesCost

    const sizeDiscount = type === EntityType.Instance ? 0 : specs.storage

    const { perVolumeCost, totalCost: volumeTotalCost } =
      await VolumeManager.getCost({
        volumes,
        sizeDiscount,
        paymentMethod,
        streamDuration,
      })

    const totalCost = volumeTotalCost + computeTotalCost

    const streamCostPerHour =
      paymentMethod === PaymentMethod.Stream && streamDuration
        ? getHours(streamDuration)
        : Number.POSITIVE_INFINITY

    const totalStreamCost = totalCost * streamCostPerHour

    return {
      computeTotalCost,
      perVolumeCost,
      volumeTotalCost,
      totalCost,
      totalStreamCost,
    }
  }

  constructor(
    protected account: Account,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
    protected nodeManager: NodeManager,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
  ) {}

  async checkStatus(
    executable: Executable,
  ): Promise<ExecutableStatus | undefined> {
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
      type: EntityType.Instance,
      ipv4,
      ipv6,
      ipv6Parsed: this.formatVMIPv6Address(ipv6),
      node,
    }
  }

  async getAllocationCRN(executable: Executable): Promise<CRN | undefined> {
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

    // const nodes = await this.nodeManager.getCRNNodes()

    // let node = nodes.find((node) => node.address === url)
    // node =
    //   node ||
    //   nodes.find(
    //     (node) =>
    //       node.address &&
    //       NodeManager.normalizeUrl(node.address) ===
    //         NodeManager.normalizeUrl(url),
    //   )

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

  async getAuthPubkeyToken({
    url,
    keyPair,
  }: {
    url: string
    keyPair: KeyPair
  }) {
    const { publicKey, createdAt } = keyPair

    const { address } = this.account
    const domain = new URL(url).hostname

    // @todo: Quickfix that should be moved to the backend
    const [d] = new Date(createdAt + KEYPAIR_TTL).toISOString().split('Z')
    const expires = `${d}+00:00`

    const payload = Buffer.from(
      JSON.stringify({
        alg: 'ECDSA',
        pubkey: publicKey,
        domain,
        address,
        expires,
      }),
    ).toString('hex')

    // @todo: Refactor this
    const wallet = (this.account as any).wallet.provider.provider

    const signature = await wallet.request({
      method: 'personal_sign',
      params: [payload, address],
    })

    return {
      payload,
      signature,
    }
  }

  async sendPostOperation({
    hostname,
    operation,
    keyPair,
    authPubkey,
    vmId,
  }: {
    operation: ExecutableOperations
    vmId: string
    hostname: string
    keyPair: KeyPair
    authPubkey: SignedPublicKeyHeader
  }): Promise<Response> {
    const url = new URL(hostname + '/control/machine/' + vmId + '/' + operation)

    const signedOperationToken = await this.getAuthOperationToken(
      keyPair.privateKey,
      url.pathname,
    )

    return fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SignedOperation': JSON.stringify(signedOperationToken),
        'X-SignedPubKey': JSON.stringify(authPubkey),
      },
      mode: 'cors',
    })
  }

  async *subscribeLogs({
    hostname,
    keyPair,
    authPubkey,
    vmId,
    abort,
  }: {
    vmId: string
    hostname: string
    keyPair: KeyPair
    authPubkey: SignedPublicKeyHeader
    abort: Promise<void>
  }): AsyncGenerator<string[]> {
    const url = new URL(
      hostname.replace('https://', 'wss://') +
        '/control/machine/' +
        vmId +
        '/logs',
    )

    const signedOperationToken = await this.getAuthOperationToken(
      keyPair.privateKey,
      url.pathname,
    )

    const feed = subscribeSocketFeed<any>(url.toString(), abort)

    const { value: ws } = await feed.next()

    ws.send(
      JSON.stringify({
        auth: {
          'X-SignedOperation': signedOperationToken,
          'X-SignedPubKey': authPubkey,
        },
      }),
    )

    for await (const data of feed) {
      try {
        const parsedData = JSON.parse(data)
        console.log('parsedData', parsedData)

        // if (parsedData.status === 'connected') {
        //   authOk = true
        //   return resolve(ws)
        // }
        // if (parsedData.status === 'failed') {
        //   return reject(parsedData.reason)
        // }

        yield parsedData
      } catch (err) {
        console.log(err)
      }
    }
  }

  protected async getAuthOperationToken(privateKey: JsonWebKey, path: string) {
    const encoder = new TextEncoder()

    // @todo: Quickfix that should be moved to the backend
    const [d] = new Date().toISOString().split('Z')
    const time = `${d}+00:00`

    const payload = encoder.encode(
      JSON.stringify({
        time,
        path,
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
  ): AsyncGenerator<void, MachineVolume[] | undefined, void> {
    if (!volumes) return

    volumes = Array.isArray(volumes) ? volumes : [volumes]
    if (volumes.length === 0) return

    // @note: Create new volumes before and cast them to ExistingVolume type
    const messages = yield* this.volumeManager.addSteps(volumes)

    const parsedVolumes: (AddExistingVolume | AddPersistentVolume)[] =
      volumes.map((volume, i) => {
        if (volume.volumeType === VolumeType.New) {
          return {
            ...volume,
            volumeType: VolumeType.Existing,
            refHash: messages[i].id,
          } as AddExistingVolume
        }

        return volume
      })

    // @todo: Fix SDK types (mount is not an string[], remove is_read_only fn)
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
      } = volume

      return { ref, mount, use_latest }
    }) as unknown as MachineVolume[]
  }

  protected parseSpecs(
    specs: InstanceSpecsField,
  ): Omit<MachineResources, 'seconds'> {
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
      if (payment.chain === BlockchainId.AVAX)
        return {
          chain: BlockchainId.AVAX,
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
}
