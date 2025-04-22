import {
  apiServer,
  crnListProgramUrl,
  defaultAccountChannel,
  monitorAddress,
  postType,
  scoringAddress,
  tags,
  wsServer,
  channel,
} from '@/helpers/constants'
import { Account } from '@aleph-sdk/account'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import { AggregateMessage, ItemType } from '@aleph-sdk/message'
import {
  extractValidEthAddress,
  fetchAndCache,
  getLatestReleases,
  getVersionNumber,
  sleep,
} from '@/helpers/utils'
import { FileManager } from './file'
import { subscribeSocketFeed } from '@/helpers/socket'
import {
  newCCNSchema,
  newCRNSchema,
  updateCCNSchema,
  updateCRNSchema,
  urlSchema,
} from '@/helpers/schemas/base'
import Err from '@/helpers/errors'

export type NodeType = 'ccn' | 'crn'

export type NodeLastVersions = {
  latest: string | null
  prerelease: string | null
  outdated: string | null
}

export type BaseNodeStatus = 'active' | 'waiting'

export type BaseNode = {
  hash: string
  owner: string
  reward: string
  locked: boolean
  authorized?: string[]
  time: number
  score: number
  score_updated: boolean
  decentralization: number
  performance: number
  name?: string
  picture?: string
  banner?: string
  description?: string
  manager?: string // not needed in CRN & optional in CCN

  // --------- CCN fields ?
  registration_url?: string

  virtual?: number
}

export type CCN = BaseNode & {
  multiaddress?: string
  status: BaseNodeStatus

  has_bonus: boolean
  resource_nodes: string[]
  stakers: Record<string, number>
  total_staked: number
  scoreData?: CCNScore
  metricsData?: CCNMetrics
  crnsData: CRN[]
}

export type CRN = BaseNode & {
  address?: string
  status: BaseNodeStatus | 'linked'

  parent: string | null
  type: string | 'compute'
  scoreData?: CRNScore
  metricsData?: CRNMetrics
  parentData?: CCN
  stream_reward?: string
  terms_and_conditions?: string
}

export type AlephNode = CCN | CRN

export type BaseNodeScore = {
  decentralization: number
  node_id: string
  performance: number
  total_score: number
  version: number
}

export type BaseNodeScoreMeasurements = {
  total_nodes: number
  node_version_other: number
  node_version_latest: number
  node_version_missing: number
  node_version_obsolete: number
  node_version_outdated: number
  base_latency_score_p25: number
  base_latency_score_p95: number
  node_version_prerelease: number
  nodes_with_identical_asn: number
}

export type CCNScore = BaseNodeScore & {
  measurements: BaseNodeScoreMeasurements & {
    metrics_latency_score_p25: number
    metrics_latency_score_p95: number
    aggregate_latency_score_p25: number
    aggregate_latency_score_p95: number
    eth_height_remaining_score_p25: number
    eth_height_remaining_score_p95: number
    file_download_latency_score_p25: number
    file_download_latency_score_p95: number
  }
}

export type CRNScore = BaseNodeScore & {
  measurements: BaseNodeScoreMeasurements & {
    full_check_latency_score_p25: number
    full_check_latency_score_p95: number
    diagnostic_vm_latency_score_p25: number
    diagnostic_vm_latency_score_p95: number
  }
}

export type BaseNodeMetrics = {
  asn: number
  url: string
  as_name: string
  node_id: string
  version: string
  measured_at: number
  base_latency: number
  base_latency_ipv4: number
}

export type CCNMetrics = BaseNodeMetrics & {
  txs_total: number
  metrics_latency: number
  pending_messages: number
  aggregate_latency: number
  file_download_latency: number
  eth_height_remaining: number
}

export type CRNMetrics = BaseNodeMetrics & {
  full_check_latency: number
  diagnostic_vm_latency: number
}

export type NewCCN = {
  name: string
  multiaddress?: string
}

export type NewCRN = {
  name: string
  address: string
}

export type BaseUpdateNode = {
  hash?: string
  picture?: string | File
  banner?: string | File
  name?: string
  description?: string
  reward?: string
  authorized?: string | string[]
  locked?: boolean
  registration_url?: string
  manager?: string
}

export type UpdateCCN = BaseUpdateNode & {
  multiaddress?: string
}

export type UpdateCRN = BaseUpdateNode & {
  address?: string
  stream_reward?: string
  terms_and_conditions?: string | File
}

export type UpdateAlephNode = UpdateCCN | UpdateCRN

export type NodesResponse = { ccns: CCN[]; crns: CRN[]; timestamp: number }

// ---------- @todo: refactor into npm package

export type ChainInfo = {
  chain_id: number
  rpc: string
  token: string
  super_token?: string
  active?: boolean
}

export type CRNConfig = {
  hash: string
  name?: string
  DOMAIN_NAME: string
  version: string
  references: {
    API_SERVER: string
    CHECK_FASTAPI_VM_ID: string
    CONNECTOR_URL: string
  }
  security: {
    USE_JAILER: boolean
    PRINT_SYSTEM_LOGS: boolean
    WATCH_FOR_UPDATES: boolean
    ALLOW_VM_NETWORKING: boolean
    USE_DEVELOPER_SSH_KEYS: boolean
  }
  networking: {
    IPV6_ADDRESS_POOL: string
    IPV6_ALLOCATION_POLICY: string
    IPV6_SUBNET_PREFIX: number
    IPV6_FORWARDING_ENABLED: boolean
    USE_NDP_PROXY: boolean
  }
  debug: {
    SENTRY_DSN_CONFIGURED: boolean
    DEBUG_ASYNCIO: boolean
    EXECUTION_LOG_ENABLED: boolean
  }
  payment: {
    // Legacy
    PAYMENT_SUPER_TOKEN?: string
    PAYMENT_CHAIN_ID?: number
    // Current
    PAYMENT_RECEIVER_ADDRESS: string
    AVAILABLE_PAYMENTS?: { [key: string]: ChainInfo }
    PAYMENT_MONITOR_INTERVAL: number
    // Extra
    matched_reward_addresses: boolean
  }
  computing: {
    ENABLE_QEMU_SUPPORT: boolean
    INSTANCE_DEFAULT_HYPERVISOR: string
    ENABLE_CONFIDENTIAL_COMPUTING?: boolean
  }
}

export type GPUDevice = {
  vendor: string
  model: string
  device_name: string
  device_class: string
  device_id: string
  compatible: boolean
  pci_host: string
}

export type Specs = {
  cpu: {
    count: number
    load_average: {
      load1: number
      load5: number
      load15: number
    }
    core_frequencies: {
      min: number
      max: number
    }
  }
  mem: {
    total_kB: number
    available_kB: number
  }
  disk: {
    total_kB: number
    available_kB: number
  }
  period: {
    start_timestamp: string
    duration_seconds: number
  }
  properties: {
    cpu: {
      architecture: string
      vendor: string
      features?: string[]
    }
  }
  gpu?: {
    devices?: GPUDevice[]
    available_devices?: GPUDevice[]
  }
  active: boolean
  version?: string
  compatible_gpus?: GPUDevice[]
  compatible_available_gpus?: GPUDevice[]
  gpu_support?: boolean | null
  confidential_support?: boolean
  qemu_support?: boolean
  ipv6_check?: {
    host: boolean
    vm: boolean
  }
  selectedGpu?: GPUDevice
}

export type CRNSpecs = (CRN & Specs) | (CRN & Partial<Specs>)

export type CRNBenchmark = {
  hash: string
  name?: string
  cpu: {
    benchmark: {
      series: number[]
      average: number
      average_str: string
      total: number
    }
  }
  ram: {
    duration: number
    speed: number
    speed_str: string
  }
}

// ---------- @todo: refactor into npm package

export type CRNIps = {
  hash: string
  name?: string
  host: boolean
  vm: boolean
}

export enum StreamNotSupportedIssue {
  Valid = 0,
  IPV6 = 1,
  MinSpecs = 2,
  Version = 3,
  RewardAddress = 4,
  MismatchRewardAddress = 5,
}

export type ReducedCRNSpecs = {
  cpu: number
  ram: number
  storage: number
}

// @todo: Refactor (create a domain npm package and move this there)
export class NodeManager {
  static newCCNSchema = newCCNSchema
  static newCRNSchema = newCRNSchema
  static updateCCNSchema = updateCCNSchema
  static updateCRNSchema = updateCRNSchema

  static maxStakedPerNode = 1_000_000
  static maxLinkedPerNode = 5

  static validateMinNodeSpecs(
    minSpecs: ReducedCRNSpecs,
    nodeSpecs: CRNSpecs,
  ): boolean {
    return (
      minSpecs.cpu <= (nodeSpecs.cpu?.count || 0) &&
      minSpecs.ram <= (nodeSpecs.mem?.available_kB || 0) / 1024 &&
      minSpecs.storage <= (nodeSpecs.disk?.available_kB || 0) / 1024
    )
  }

  static normalizeUrl(url: string): string {
    return url?.toLowerCase().replace(/\/$/, '')
  }

  constructor(
    protected fileManager: FileManager,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected account?: Account,
    protected channel = defaultAccountChannel,
  ) {}

  async getCCNNodes(): Promise<CCN[]> {
    const { ccns } = await this.getAllNodes()
    return ccns
  }

  async getCRNNodes(): Promise<CRN[]> {
    const { crns } = await this.getAllNodes()
    return crns
  }

  async getAllNodes(): Promise<NodesResponse> {
    const response = await this.fetchAllNodes()

    const { timestamp } = response
    let { ccns, crns } = response

    crns = this.parseResourceNodes(crns)

    crns = await this.parseScores(crns, true)
    crns = await this.parseMetrics(crns, true)

    ccns = await this.parseScores(ccns, false)
    ccns = await this.parseMetrics(ccns, false)

    this.linkChildrenNodes(ccns, crns)
    this.linkParentNodes(crns, ccns)

    return { ccns, crns, timestamp }
  }

  async *subscribeNodesFeed(
    abort: Promise<void>,
  ): AsyncGenerator<NodesResponse> {
    const feed = subscribeSocketFeed<AggregateMessage<any>>(
      `${wsServer}/api/ws0/messages?msgType=AGGREGATE&history=1&addresses=${monitorAddress}`,
      abort,
    )

    // @note: Consume socket first step
    await feed.next()

    for await (const data of feed) {
      if (!data.content) return
      if (!data.content.content) return

      const { content, address, key, time } = data.content || {}
      const { nodes, resource_nodes } = content

      if (
        address === monitorAddress &&
        key === 'corechannel' &&
        (nodes !== undefined || resource_nodes !== undefined)
      ) {
        let crns: CRN[] = resource_nodes as any
        let ccns: CCN[] = nodes as any

        crns = this.parseResourceNodes(crns)

        crns = await this.parseScores(crns, true)
        crns = await this.parseMetrics(crns, true)

        ccns = await this.parseScores(ccns, false)
        ccns = await this.parseMetrics(ccns, false)

        this.linkChildrenNodes(ccns, crns)
        this.linkParentNodes(crns, ccns)

        const timestamp = Math.trunc(time * 1000)

        yield { ccns, crns, timestamp }
      }
    }
  }

  async getAllCRNsSpecs(): Promise<CRNSpecs[]> {
    try {
      const response = await fetchAndCache(
        crnListProgramUrl,
        `all_crn_specs`,
        3_600,
        (res: { crns: any[]; last_refresh: string }) => {
          if (res.crns === undefined) throw Err.InvalidResponse

          const formattedCrns: CRNSpecs[] = res.crns.map((crn) => {
            const { system_usage, ...rest } = crn
            return {
              ...system_usage,
              ...rest,
            }
          })

          return {
            ...res,
            crns: formattedCrns,
          }
        },
      )

      return response.crns
    } catch (e) {
      console.error(e)
      return []
    }
  }

  // @todo: move this to domain package
  async getCRNsSpecs(nodes: CRN[]): Promise<CRNSpecs[]> {
    const specs = await Promise.all(nodes.map((node) => this.getCRNspecs(node)))
    const filtered = specs.filter((spec) => spec !== undefined) as CRNSpecs[]
    return filtered
  }

  async getCRNspecs(node: CRN, retries = 2): Promise<CRNSpecs | undefined> {
    if (!node.address) return

    const nodeUrl = NodeManager.normalizeUrl(node.address)
    const url = `${nodeUrl}/about/usage/system`

    const { success } = urlSchema.safeParse(url)
    if (!success) return

    try {
      return await fetchAndCache(
        url,
        `crn_specs_${node.hash}_1`,
        3_600,
        (res: CRNSpecs) => {
          if (res.cpu === undefined) throw Err.InvalidResponse

          return {
            ...res,
            hash: node.hash,
            name: node.name,
          }
        },
      )
    } catch (e) {
      if (!retries) return
      await sleep(100 * 2)
      return this.getCRNspecs(node, retries - 1)
    }
  }

  async getCRNConfig(node: CRN, retries = 2): Promise<CRNConfig | undefined> {
    if (!node.address) return

    const address = node.address.toLowerCase().replace(/\/$/, '')
    const url = `${address}/status/config`
    const { success } = urlSchema.safeParse(url)
    if (!success) return

    try {
      return await fetchAndCache(
        url,
        `crn_specs_${node.hash}_2`,
        3_600,
        (res: CRNConfig) => {
          return {
            ...res,
            hash: node.hash,
            name: node.name,
            payment: {
              ...res.payment,
              matched_reward_addresses:
                res.payment.PAYMENT_RECEIVER_ADDRESS === node.stream_reward,
            },
          }
        },
      )
    } catch (e) {
      if (!retries) return
      await sleep(100 * 2)
      return this.getCRNConfig(node, retries - 1)
    }
  }

  async getCRNips(node: CRN, retries = 2): Promise<CRNIps | undefined> {
    if (!node.address) return

    const address = node.address.toLowerCase().replace(/\/$/, '')
    const url = `${address}/status/check/ipv6`
    const { success } = urlSchema.safeParse(url)
    if (!success) return

    try {
      return await fetchAndCache(
        url,
        `crn_ips_${node.hash}_1`,
        3_600,
        (res: CRNIps) => {
          if (res.vm === undefined) throw Err.InvalidResponse

          return {
            ...res,
            hash: node.hash,
            name: node.name,
          }
        },
      )
    } catch (e) {
      if (!retries) return
      await sleep(100 * 2)
      return this.getCRNips(node, retries - 1)
    }
  }

  async getCRNBenchmark(
    node: CRN,
    retries = 4,
  ): Promise<CRNBenchmark | undefined> {
    if (!node.address) return
    const { hash, name } = node

    const address = node.address.toLowerCase().replace(/\/$/, '')
    const url1 = `${address}/vm/873889eb4ce554385e7263724bd0745130099c24fd9c535f0a648100138a2514/benchmark`
    const url2 = `${address}/vm/873889eb4ce554385e7263724bd0745130099c24fd9c535f0a648100138a2514/memory_speed`

    const { success: success1 } = urlSchema.safeParse(url1)
    const { success: success2 } = urlSchema.safeParse(url2)

    if (!success1 || !success2) return

    try {
      const [cpu, ram] = await Promise.all([
        fetchAndCache(
          url1,
          `4crn_benchmark_cpu_${node.hash}`,
          3_600,
          (res: CRNBenchmark['cpu']) => {
            if (res.benchmark === undefined) throw Err.InvalidResponse
            return res
          },
        ),
        fetchAndCache(
          url2,
          `4crn_benchmark_ram_${node.hash}`,
          3_600,
          (res: CRNBenchmark['ram']) => {
            if (res.speed_str === undefined) throw Err.InvalidResponse
            return res
          },
        ),
      ])

      return {
        hash,
        name,
        cpu,
        ram,
      }
    } catch (e) {
      if (!retries) return
      await sleep(100 * 2)
      return this.getCRNBenchmark(node, retries - 1)
    }
  }

  async getLatestVersion(node: AlephNode): Promise<NodeLastVersions> {
    return this.isCRN(node)
      ? this.getLatestCRNVersion()
      : this.getLatestCCNVersion()
  }

  async getLatestCCNVersion(): Promise<NodeLastVersions> {
    return fetchAndCache(
      'https://api.github.com/repos/aleph-im/pyaleph/releases',
      'ccn_versions',
      300_000,
      getLatestReleases,
    )
  }

  async getLatestCRNVersion(): Promise<NodeLastVersions> {
    return fetchAndCache(
      'https://api.github.com/repos/aleph-im/aleph-vm/releases',
      'crn_versions',
      300_000,
      getLatestReleases,
    )
  }

  async newCoreChannelNode(newCCN: NewCCN): Promise<string> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    newCCN = await NodeManager.newCCNSchema.parseAsync(newCCN)

    const res = await this.sdkClient.createPost({
      postType,
      channel,
      content: {
        tags: ['create-node', ...tags],
        action: 'create-node',
        details: newCCN,
      },
      storageEngine: ItemType.inline,
    })

    return res.item_hash
  }

  async newComputeResourceNode(newCRN: NewCRN): Promise<string> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    newCRN = await NodeManager.newCRNSchema.parseAsync(newCRN)

    const res = await this.sdkClient.createPost({
      postType,
      channel,
      content: {
        tags: ['create-resource-node', ...tags],
        action: 'create-resource-node',
        details: { ...newCRN, type: 'compute' },
      },
      storageEngine: ItemType.inline,
    })

    return res.item_hash
  }

  async updateCoreChannelNode(
    updateCCN: UpdateCCN,
  ): Promise<[string, Partial<CCN>]> {
    updateCCN = await NodeManager.updateCCNSchema.parseAsync(updateCCN)

    return this.updateNode(updateCCN, 'create-node')
  }

  async updateComputeResourceNode(
    updateCRN: UpdateCRN,
  ): Promise<[string, Partial<CRN>]> {
    updateCRN = await NodeManager.updateCRNSchema.parseAsync(updateCRN)

    return this.updateNode(updateCRN, 'create-resource-node')
  }

  async removeNode(hash: string): Promise<string> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    const res = await this.sdkClient.createPost({
      postType,
      channel,
      ref: hash,
      content: {
        tags: ['drop-node', ...tags],
        action: 'drop-node',
      },
      storageEngine: ItemType.inline,
    })

    return res.item_hash
  }

  async linkComputeResourceNode(crnHash: string): Promise<void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    await this.sdkClient.createPost({
      postType,
      channel,
      ref: crnHash,
      content: {
        tags: ['link', ...tags],
        action: 'link',
      },
      storageEngine: ItemType.inline,
    })
  }

  async unlinkComputeResourceNode(crnHash: string): Promise<void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    await this.sdkClient.createPost({
      postType,
      channel,
      ref: crnHash,
      content: {
        tags: ['unlink', ...tags],
        action: 'unlink',
      },
      storageEngine: ItemType.inline,
    })
  }

  protected async fetchAllNodes(): Promise<NodesResponse> {
    return fetchAndCache(
      `${apiServer}/api/v0/aggregates/0xa1B3bb7d2332383D96b7796B908fB7f7F3c2Be10.json?keys=corechannel&limit=100`,
      'nodes',
      1000 * 5,
      async (content: any) => {
        // const content = await res.json()
        const crns: CRN[] = content?.data?.corechannel?.resource_nodes
        const ccns: CCN[] = content?.data?.corechannel?.nodes

        const timestamp = 0

        return { ccns, crns, timestamp }
      },
    )
  }

  protected async updateNode<U extends UpdateAlephNode, N extends AlephNode>(
    { hash, ...details }: U,
    action: 'create-node' | 'create-resource-node',
  ): Promise<[string, Partial<N>]> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    if (!hash) throw Err.InvalidParameter('hash')

    if (!details.locked) {
      details.registration_url = ''
    }

    if (details.picture instanceof File) {
      const { contentItemHash } = await this.fileManager.uploadFile(
        details.picture,
      )
      details.picture = contentItemHash
    }

    if (details.banner instanceof File) {
      const { contentItemHash } = await this.fileManager.uploadFile(
        details.banner,
      )
      details.banner = contentItemHash
    }

    if (
      'terms_and_conditions' in details &&
      details.terms_and_conditions instanceof File
    ) {
      const { messageItemHash } = await this.fileManager.uploadFile(
        details.terms_and_conditions,
      )
      details.terms_and_conditions = messageItemHash
    }

    const res = await this.sdkClient.createPost({
      postType: 'amend',
      ref: hash,
      content: {
        tags: [action, ...tags],
        action,
        details,
      },
      channel,
      storageEngine: ItemType.inline,
    })

    return [
      res.item_hash,
      {
        hash,
        ...details,
        picture: details.picture as string,
        banner: details.banner as string,
      } as unknown as Partial<N>,
    ]
  }

  isCRN(node: AlephNode): node is CRN {
    return Object.hasOwn(node, 'parent')
  }

  isKYCRequired(node: CCN): boolean {
    return node.registration_url !== undefined && node.registration_url !== ''
  }

  isKYCCleared(node: CCN): boolean {
    if (!this.account) return false
    return node.authorized?.includes(this.account.address) || false
  }

  isLocked(node: CCN): boolean {
    if (!node.locked) return false
    return !(this.isKYCRequired(node) && this.isKYCCleared(node))
  }

  isUserNode(node: AlephNode): boolean {
    if (!this.account) return false
    return this.account.address === node.owner
  }

  isUserStake(node: CCN): boolean {
    if (!this.account) return false
    return !!node.stakers[this.account.address]
  }

  isLinked(node: CRN): boolean {
    return !!node.parentData
  }

  isUserLinked(node: CRN, userNode?: CCN): boolean {
    if (!userNode) return false

    return (
      (this.isUserNode(userNode) && userNode.hash === node.parent) ||
      (this.isUserNode(node) && !!node.parent)
    )
  }

  isUnlinkableBy(node: CRN, userNode?: CCN): boolean {
    if (!userNode) return false

    return (
      (this.isUserNode(userNode) && userNode.hash === node.parent) ||
      (this.isUserNode(node) && !!node.parent)
    )
  }

  isStakeable(node: CCN): [boolean, string] {
    if (node.total_staked >= NodeManager.maxStakedPerNode)
      return [false, 'Too many ALEPH staked on that node']

    if (this.isLocked(node)) return [false, 'This node is locked']

    return [true, `${node.hash} is stakeable`]
  }

  isStakeableBy(node: CCN, balance: number | undefined): [boolean, string] {
    const isStakeable = this.isStakeable(node)
    if (!isStakeable[0]) return isStakeable

    if (!balance || balance < 10_000)
      return [false, 'You need at least 10000 ALEPH to stake']

    if (this.isUserNode(node))
      return [false, "You can't stake while you operate a node"]

    if (this.isUserStake(node)) return [false, 'Already staking in this node']

    return [true, `Stake ${balance.toFixed(2)} ALEPH in this node`]
  }

  isLinkable(node: CRN): [boolean, string] {
    if (node.locked) return [false, 'This node is locked']

    if (!!node.parent)
      return [false, `The node is already linked to ${node.parent} ccn`]

    return [true, `${node.hash} is linkable`]
  }

  isLinkableBy(node: CRN, userNode: CCN | undefined): [boolean, string] {
    const isLinkable = this.isLinkable(node)
    if (!isLinkable[0]) return isLinkable

    if (!userNode || !this.isUserNode(userNode))
      return [false, "The user doesn't own a core channel node"]

    if (node.locked) return [false, 'This node is locked']

    if (!!node.parent)
      return [false, `The node is already linked to ${node.parent} ccn`]

    if (userNode.resource_nodes.length >= NodeManager.maxLinkedPerNode)
      return [
        false,
        `The user node is already linked to ${userNode.resource_nodes.length} nodes`,
      ]

    return [true, `Link ${node.hash} to ${userNode.hash}`]
  }

  hasIssues(node: AlephNode, staking = false): string | undefined {
    if (this.isCRN(node)) {
      if (node.score < 0.8) return 'The CRN is underperforming'
      if (!node.parentData) return 'The CRN is not being linked to a CCN'
      if ((node?.parentData?.score || 0) <= 0)
        return 'The linked CCN is underperforming'
    } else {
      if (node.score < 0.8) return 'The CCN is underperforming'
      if ((node?.crnsData.length || 0) < 2)
        return 'The CCN has free slots to link more CRNs'
      if (!staking && node?.crnsData.some((crn) => crn.score < 0.8))
        return 'One of the linked CRN is underperforming'
    }
  }

  getNodeVersionNumber(node: CRN | CRNSpecs): number {
    // CRNSpecs has version directly on the object
    if ('cpu' in node && node.version) {
      return getVersionNumber(node.version)
    }

    // For CRN type, version is in metricsData
    if ('metricsData' in node && node.metricsData?.version) {
      return getVersionNumber(node.metricsData.version)
    }

    return 0
  }

  isStreamPaymentNotSupported(node: CRN | CRNSpecs): StreamNotSupportedIssue {
    // Basic check for stream reward address - works with both types
    if (!extractValidEthAddress(node.stream_reward))
      return StreamNotSupportedIssue.RewardAddress

    // Version check - works with both types
    if (this.getNodeVersionNumber(node) < getVersionNumber('1.1.0'))
      return StreamNotSupportedIssue.Version

    // Note: We can't check for address mismatch synchronously
    // but the other checks are the most common failures

    return StreamNotSupportedIssue.Valid
  }

  async isStreamPaymentFullySupported(node: CRN | CRNSpecs): Promise<boolean> {
    // Run basic checks first
    const basicCheck = this.isStreamPaymentNotSupported(node)
    if (basicCheck !== StreamNotSupportedIssue.Valid) {
      return false
    }

    // Additional checks for CRNSpecs that require async operations
    if ('cpu' in node) {
      const config = await this.getCRNConfig(node)
      if (!config?.payment.matched_reward_addresses) {
        return false
      }
    }

    return true
  }

  validateMinNodeSpecs(
    minSpecs: ReducedCRNSpecs,
    nodeSpecs: CRNSpecs,
  ): boolean {
    return NodeManager.validateMinNodeSpecs(minSpecs, nodeSpecs)
  }

  protected parseResourceNodes(crns: CRN[]): CRN[] {
    return crns.map((crn) => {
      // @note: some nodes has {locked: ""}
      crn.locked = !!crn.locked
      return crn
    })
  }

  protected linkChildrenNodes(ccns: CCN[], crns: CRN[]): void {
    const crnsMap = crns.reduce(
      (ac, cu) => {
        if (!cu.parent) return ac

        const crns = (ac[cu.parent] = ac[cu.parent] || [])
        crns.push(cu)

        return ac
      },
      {} as Record<string, CRN[]>,
    )

    ccns.forEach((ccn) => {
      const crnsData = crnsMap[ccn.hash] || []
      if (!crnsData) return

      ccn.crnsData = crnsData
    })
  }

  protected linkParentNodes(crns: CRN[], ccns: CCN[]): void {
    const ccnsMap = ccns.reduce(
      (ac, cu) => {
        ac[cu.hash] = cu
        return ac
      },
      {} as Record<string, CCN>,
    )

    crns.forEach((crn) => {
      if (!crn.parent) return

      const parentData = ccnsMap[crn.parent]
      if (!parentData) return

      crn.parentData = parentData
    })
  }

  protected async parseScores<T extends AlephNode>(
    nodes: T[],
    isCRN: boolean,
  ): Promise<T[]> {
    const scores = isCRN ? await this.getCRNScores() : await this.getCCNScores()
    const scoresMap = new Map(scores.map((score) => [score.node_id, score]))

    return nodes.map((node) => {
      const scoreData = scoresMap.get(node.hash)
      if (!scoreData) return node

      return {
        ...node,
        score: scoreData.total_score,
        decentralization: scoreData.decentralization,
        performance: scoreData.performance,
        version: scoreData.version,
        scoreData,
      }
    })
  }

  protected async parseMetrics<T extends AlephNode>(
    nodes: T[],
    isCRN: boolean,
  ): Promise<T[]> {
    const metrics = isCRN
      ? await this.getCRNMetrics()
      : await this.getCCNMetrics()

    const metricsMap = new Map(
      metrics.map((metrics) => [metrics.node_id, metrics]),
    )

    return nodes.map((node) => {
      const metricsData = metricsMap.get(node.hash)
      if (!metricsData) return node

      return {
        ...node,
        metricsData,
      }
    })
  }

  protected async getScores(): Promise<{
    ccn: CCNScore[]
    crn: CRNScore[]
  }> {
    const res = await this.sdkClient.getPosts({
      types: 'aleph-scoring-scores',
      addresses: [scoringAddress],
      pagination: 1,
      page: 1,
    })

    return (res.posts[0]?.content as any)?.scores
  }

  protected async getMetrics(): Promise<{
    ccn: CCNMetrics[]
    crn: CRNMetrics[]
  }> {
    const res = await this.sdkClient.getPosts({
      types: 'aleph-network-metrics',
      addresses: [scoringAddress],
      pagination: 1,
      page: 1,
    })

    return (res.posts[0]?.content as any)?.metrics
  }

  protected async getCCNScores(): Promise<CCNScore[]> {
    const res = await this.getScores()
    return res.ccn
  }

  protected async getCCNMetrics(): Promise<CCNMetrics[]> {
    const res = await this.getMetrics()
    return res.ccn
  }

  protected async getCRNScores(): Promise<CRNScore[]> {
    const res = await this.getScores()
    return res.crn
  }

  protected async getCRNMetrics(): Promise<CRNMetrics[]> {
    const res = await this.getMetrics()
    return res.crn
  }
}
