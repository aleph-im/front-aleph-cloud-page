import {
  apiServer,
  defaultAccountChannel,
  scoringAddress,
} from '@/helpers/constants'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { messages } from 'aleph-sdk-ts'
import {
  fetchAndCache,
  getLatestReleases,
  getVersionNumber,
  sleep,
} from '@/helpers/utils'
import { FileManager } from './file'
import { urlSchema } from '@/helpers/schemas/base'

const { post } = messages

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
  manager?: string

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
  stream_reward?: string
  status: BaseNodeStatus | 'linked'

  parent: string | null
  type: string | 'compute'
  scoreData?: CRNScore
  metricsData?: CRNMetrics
  parentData?: CCN
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
}

export type UpdateAlephNode = UpdateCCN | UpdateCRN

export type NodesResponse = { ccns: CCN[]; crns: CRN[]; timestamp: number }

// ---------- @todo: refactor into npm package

export type CRNSpecs = {
  hash: string
  name?: string
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
    }
  }
  active: boolean
}

// ---------- @todo: refactor into npm package

export type CRNIps = {
  hash: string
  name?: string
  result: boolean
}

// @todo: Refactor (create a domain npm package and move this there)
export class NodeManager {
  constructor(
    protected account?: Account,
    protected channel = defaultAccountChannel,
    protected fileManager: FileManager = new FileManager(account, channel),
  ) {}

  async getCCNNodes(): Promise<CCN[]> {
    const res = await this.fetchAllNodes()
    let { ccns, crns } = res

    crns = this.parseResourceNodes(crns)

    ccns = this.parseChildrenResourceNodes(ccns, crns)
    ccns = await this.parseScores(ccns, false)
    ccns = await this.parseMetrics(ccns, false)

    return ccns
  }

  async getCRNNodes(): Promise<CRN[]> {
    const res = await this.fetchAllNodes()

    const { ccns } = res
    let { crns } = res

    crns = this.parseResourceNodes(crns)

    crns = this.parseParentNodes(crns, ccns)
    crns = await this.parseScores(crns, true)
    crns = await this.parseMetrics(crns, true)

    return crns
  }

  async getAllNodes(): Promise<NodesResponse> {
    const response = await this.fetchAllNodes()

    const { timestamp } = response
    let { ccns, crns } = response

    crns = this.parseResourceNodes(crns)

    ccns = this.parseChildrenResourceNodes(ccns, crns)
    ccns = await this.parseScores(ccns, false)
    ccns = await this.parseMetrics(ccns, false)

    crns = this.parseParentNodes(crns, ccns)
    crns = await this.parseScores(crns, true)
    crns = await this.parseMetrics(crns, true)

    return { ccns, crns, timestamp }
  }

  // @todo: move this to domain package
  async getCRNsSpecs(nodes: CRN[]): Promise<CRNSpecs[]> {
    const specs = await Promise.all(nodes.map((node) => this.getCRNspecs(node)))
    console.log('specs', specs)
    const filtered = specs.filter((spec) => spec !== undefined) as CRNSpecs[]
    console.log('filtered', filtered)
    return filtered
  }

  async getCRNspecs(node: CRN, retries = 2): Promise<CRNSpecs | undefined> {
    if (!node.address) return

    const address = node.address.toLowerCase().replace(/\/$/, '')
    const url = `${address}/vm/78451e20da3c19a3e2cd8e97526e09244631fba12f451b9b60cdb2915ab0e414/about/usage/system`

    const { success } = urlSchema.safeParse(url)
    if (!success) return

    try {
      return await fetchAndCache(
        url,
        `3crn_specs_${node.hash}`,
        3_600,
        (res: CRNSpecs) => {
          if (res.cpu === undefined) throw new Error('invalid response')

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

  async getCRNips(node: CRN, retries = 2): Promise<CRNIps | undefined> {
    if (!node.address) return

    const address = node.address.toLowerCase().replace(/\/$/, '')
    const url = `${address}/vm/3fc0aa9569da840c43e7bd2033c3c580abb46b007527d6d20f2d4e98e867f7af/ip/6`
    const { success } = urlSchema.safeParse(url)
    if (!success) return

    try {
      return await fetchAndCache(
        url,
        `3crn_ips_${node.hash}`,
        4_600,
        (res: CRNIps) => {
          if (res.result === undefined) throw new Error('invalid response')

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

  getNodeVersionNumber(node: CRN): number {
    if (!node.metricsData?.version) return 0
    return getVersionNumber(node.metricsData?.version)
  }

  isStreamPaymentSupported(node: CRN): boolean {
    return (
      true ||
      node.hash ===
        '4680d7473e914883839f3b9aa7bb3739cdba83d5f99a4b673b9abd8f8f6c1c97' ||
      (!!node.stream_reward &&
        this.getNodeVersionNumber(node) >= getVersionNumber('v0.4.0'))
    )
  }

  protected parseResourceNodes(crns: CRN[]): CRN[] {
    return crns.map((crn) => {
      // @note: some nodes has {locked: ""}
      crn.locked = !!crn.locked
      return crn
    })
  }

  protected parseChildrenResourceNodes(ccns: CCN[], crns: CRN[]): CCN[] {
    const crnsMap = crns.reduce((ac, cu) => {
      if (!cu.parent) return ac

      const crns = (ac[cu.parent] = ac[cu.parent] || [])
      crns.push(cu)

      return ac
    }, {} as Record<string, CRN[]>)

    return ccns.map((ccn) => {
      const crnsData = crnsMap[ccn.hash] || []
      if (!crnsData) return ccn

      return {
        ...ccn,
        crnsData,
      }
    })
  }

  protected parseParentNodes(crns: CRN[], ccns: CCN[]): CRN[] {
    const ccnsMap = ccns.reduce((ac, cu) => {
      ac[cu.hash] = cu
      return ac
    }, {} as Record<string, CCN>)

    return crns.map((crn) => {
      if (!crn.parent) return crn

      const parentData = ccnsMap[crn.parent]
      if (!parentData) return crn

      return {
        ...crn,
        parentData,
      }
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
    const res = await post.Get({
      types: 'aleph-scoring-scores',
      addresses: [scoringAddress],
      pagination: 1,
      page: 1,
      APIServer: apiServer,
    })

    return (res.posts[0]?.content as any)?.scores
  }

  protected async getMetrics(): Promise<{
    ccn: CCNMetrics[]
    crn: CRNMetrics[]
  }> {
    const res = await post.Get({
      types: 'aleph-network-metrics',
      addresses: [scoringAddress],
      pagination: 1,
      page: 1,
      APIServer: apiServer,
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
