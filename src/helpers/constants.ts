// ------------------------ @todo: Refactor in domain package --------------------

export const defaultAccountChannel = 'ALEPH-ACCOUNT'

// Default node ops message config
export const channel = 'FOUNDATION'
export const tags = ['mainnet']
export const postType = 'corechan-operation'

export const apiServer = 'https://api1.aleph.im'
export const wsServer = 'wss://api1.aleph.im'
export const mbPerAleph = 3

export const scoringAddress = '0x4D52380D3191274a04846c89c069E6C3F2Ed94e4'
export const monitorAddress = '0xa1B3bb7d2332383D96b7796B908fB7f7F3c2Be10'
export const senderAddress = '0x3a5CC6aBd06B601f4654035d125F9DD2FC992C25'
export const erc20Address = '0x27702a26126e0B3702af63Ee09aC4d1A084EF628'
export const splTokenAddress = '3UCMiSnkcnkPE1pgQ5ggPCBv6dXgVUy16TmMUe1WpG9x'

export const websiteUrl = 'https://www.twentysix.cloud'

// ---------------------------------------------------------------------------------

export const defaultVMURL = 'https://aleph.sh/vm/'

export const programStorageURL = `${apiServer}/api/v0/storage/raw/`

export type LanguageType = 'python' | 'javascript' | 'rust' | 'go' | 'c'

export const defaultMimetype: Record<LanguageType, string> = {
  python: 'text/python',
  javascript: 'text/javascript',
  rust: 'text/rust',
  go: 'text/go',
  c: 'text/plain',
}

export const defaultFileExtension: Record<LanguageType, string> = {
  python: 'py',
  javascript: 'js',
  rust: 'rs',
  go: 'go',
  c: 'c',
}

export const defaultDomainAggregateKey = 'domains'
export const defaultSSHPostType = 'ALEPH-SSH'

export const defaultConsoleChannel = 'ALEPH-CLOUDSOLUTIONS'

export const defaultVolumeChannel = defaultConsoleChannel
export const defaultSSHChannel = defaultConsoleChannel
export const defaultInstanceChannel = defaultConsoleChannel
export const defaultProgramChannel = defaultConsoleChannel
export const defaultDomainChannel = defaultConsoleChannel

export enum EntityType {
  Volume = 'volume',
  Program = 'program',
  Instance = 'instance',
  SSHKey = 'sshKey',
  Domain = 'domain',
  Indexer = 'indexer',
  Website = 'website',
}

export type CheckoutStepType =
  | 'ssh'
  | 'volume'
  | 'domain'
  | 'stream'
  | 'instance'
  | 'program'

export enum AddDomainTarget {
  IPFS = 'ipfs',
  Program = 'program',
  Instance = 'instance',
}

export enum VolumeType {
  New = 'new',
  Existing = 'existing',
  Persistent = 'persistent',
}

export const EntityTypeName: Record<EntityType, string> = {
  [EntityType.Volume]: 'Volume',
  [EntityType.Program]: 'Function',
  [EntityType.Instance]: 'Instance',
  [EntityType.SSHKey]: 'SSH Key',
  [EntityType.Domain]: 'Domain',
  [EntityType.Indexer]: 'Indexer',
  [EntityType.Website]: 'Website',
}

export const EntityTypeUrlSection: Record<EntityType, string> = {
  [EntityType.Volume]: 'storage',
  [EntityType.Program]: 'computing',
  [EntityType.Instance]: 'computing',
  [EntityType.SSHKey]: 'configure',
  [EntityType.Domain]: 'configure',
  [EntityType.Indexer]: 'tools',
  [EntityType.Website]: 'hosting',
}

export const EntityTypeSlug: Record<EntityType, string> = {
  [EntityType.Volume]: 'volume',
  [EntityType.Program]: 'function',
  [EntityType.Instance]: 'instance',
  [EntityType.SSHKey]: 'ssh',
  [EntityType.Domain]: 'domain',
  [EntityType.Indexer]: 'indexer',
  [EntityType.Website]: 'website',
}

export enum IndexerBlockchain {
  Ethereum = 'ethereum',
  Bsc = 'bsc',
}

const ERC20AbiUrl =
  'https://api.etherscan.io/api?module=contract&action=getabi&address=0x27702a26126e0B3702af63Ee09aC4d1A084EF628'

export const BlockchainDefaultABIUrl: Record<IndexerBlockchain, string> = {
  // @note: Fixed ethereum ALEPH token contract address as "generic" ERC20 ABI for all EVM compatible blockchains
  [IndexerBlockchain.Ethereum]: ERC20AbiUrl,
  [IndexerBlockchain.Bsc]: ERC20AbiUrl,
}

export enum PaymentMethod {
  Hold = 'hold',
  Stream = 'stream',
}

export const superToken = '0x1290248E01ED2F9f863A9752A8aAD396ef3a1B00'

export enum WebsiteFrameworkId {
  none = 'none',
  react = 'react',
  nextjs = 'nextjs',
  gatsby = 'gatsby',
  svelte = 'svelte',
  vue = 'vue',
  nuxt = 'nuxt',
  angular = 'angular',
}
