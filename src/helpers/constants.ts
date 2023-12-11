export const defaultVMURL = 'https://aleph.sh/vm/'

export const programStorageURL = 'https://api2.aleph.im/api/v0/storage/raw/'

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

export const breadcrumbNames = {
  '/': 'SOLUTIONS',
  '/dashboard/function': 'SETUP NEW FUNCTION',
  '/dashboard/volume': 'SETUP NEW VOLUME',
}

export enum EntityType {
  Volume = 'volume',
  Program = 'program',
  Instance = 'instance',
  SSHKey = 'sshKey',
  Domain = 'domain',
  File = 'file',
  Indexer = 'indexer',
}

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
  [EntityType.File]: 'Pinned File',
  [EntityType.Indexer]: 'Indexer',
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
