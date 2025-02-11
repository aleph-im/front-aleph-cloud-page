import {
  apiServer,
  crnListProgramUrl,
  defaultAccountChannel,
  scoringAddress,
} from '@/helpers/constants'
import { Account } from '@aleph-sdk/account'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import {
  extractValidEthAddress,
  fetchAndCache,
  getLatestReleases,
  getVersionNumber,
  sleep,
} from '@/helpers/utils'
import { FileManager } from './file'
import { urlSchema } from '@/helpers/schemas/base'
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
}

export type CRNSpecs = BaseNode &
  CRN & {
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
    gpu_support?: boolean
    confidential_support?: boolean
    qemu_support?: boolean
    ipv6_check?: {
      host: boolean
      vm: boolean
    }
    selectedGpu?: GPUDevice
  }

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
  static validateMinNodeSpecs(
    minSpecs: ReducedCRNSpecs,
    nodeSpecs: CRNSpecs,
  ): boolean {
    return (
      minSpecs.cpu <= nodeSpecs.cpu?.count &&
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

    ccns = await this.parseScores(ccns, false)
    ccns = await this.parseMetrics(ccns, false)

    this.linkChildrenNodes(ccns, crns)

    return { ccns, crns, timestamp }
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

  isUserLinked(node: CRN, userNode?: CCN): boolean {
    if (!userNode) return false

    return (
      (this.isUserNode(userNode) && userNode.hash === node.parent) ||
      (this.isUserNode(node) && !!node.parent)
    )
  }

  getNodeVersionNumber(node: CRNSpecs): number {
    if (!node?.version) return 0
    return getVersionNumber(node?.version)
  }

  isStreamPaymentNotSupported(node: CRNSpecs): StreamNotSupportedIssue {
    if (!extractValidEthAddress(node.stream_reward))
      return StreamNotSupportedIssue.RewardAddress

    if (this.getNodeVersionNumber(node) < getVersionNumber('1.1.0'))
      return StreamNotSupportedIssue.Version

    let mismatch = false
    this.getCRNConfig(node).then((config) => {
      mismatch = !config?.payment.matched_reward_addresses
    })
    if (mismatch) return StreamNotSupportedIssue.MismatchRewardAddress

    return StreamNotSupportedIssue.Valid
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
