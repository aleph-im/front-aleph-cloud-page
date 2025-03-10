// ------------------------ @todo: Refactor in domain package --------------------

export const defaultAccountChannel = 'ALEPH-ACCOUNT'

// Default node ops message config
export const channel = 'FOUNDATION'
export const tags = ['mainnet']
export const postType = 'corechan-operation'

export const apiServer = 'https://api2.aleph.im'
export const wsServer = 'wss://api2.aleph.im'
export const mbPerAleph = 3

export const communityWalletAddress =
  '0x5aBd3258C5492fD378EBC2e0017416E199e5Da56'
export const scoringAddress = '0x4D52380D3191274a04846c89c069E6C3F2Ed94e4'
export const monitorAddress = '0xa1B3bb7d2332383D96b7796B908fB7f7F3c2Be10'
export const senderAddress = '0x3a5CC6aBd06B601f4654035d125F9DD2FC992C25'
export const erc20Address = '0x27702a26126e0B3702af63Ee09aC4d1A084EF628'
export const splTokenAddress = '3UCMiSnkcnkPE1pgQ5ggPCBv6dXgVUy16TmMUe1WpG9x'

export const crnListProgramUrl =
  'https://dchq.staging.aleph.sh/vm/bec08b08bb9f9685880f3aeb9c1533951ad56abef2a39c97f5a93683bdaa5e30/crns.json'

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
export const defaultWebsiteAggregateKey = 'websites'
export const defaultSSHPostType = 'ALEPH-SSH'

export const defaultConsoleChannel = 'ALEPH-CLOUDSOLUTIONS'

export const defaultVolumeChannel = defaultConsoleChannel
export const defaultSSHChannel = defaultConsoleChannel
export const defaultInstanceChannel = defaultConsoleChannel
export const defaultGpuInstanceChannel = defaultConsoleChannel
export const defaultProgramChannel = defaultConsoleChannel
export const defaultDomainChannel = defaultConsoleChannel
export const defaultWebsiteChannel = defaultConsoleChannel
export const defaultConfidentialChannel = defaultConsoleChannel

export enum EntityType {
  Volume = 'volume',
  Program = 'program',
  Instance = 'instance',
  GpuInstance = 'gpuInstance',
  SSHKey = 'sshKey',
  Domain = 'domain',
  Website = 'website',
  Confidential = 'confidential',
}

type CheckoutAddStepType =
  | 'ssh'
  | 'volume'
  | 'domain'
  | 'stream'
  | 'instance'
  | 'program'
  | 'website'
  | 'reserve'

type CheckoutDelStepType =
  | 'sshDel'
  | 'volumeDel'
  | 'domainDel'
  | 'streamDel'
  | 'instanceDel'
  | 'programDel'
  | 'websiteDel'

type CheckoutUpStepType =
  | 'sshUp'
  | 'volumeUp'
  | 'domainUp'
  | 'instanceUp'
  | 'programUp'
  | 'websiteUp'

export type CheckoutStepType =
  | CheckoutAddStepType
  | CheckoutDelStepType
  | CheckoutUpStepType

export enum EntityDomainType {
  IPFS = 'ipfs',
  Program = 'program',
  Instance = 'instance',
  Confidential = 'confidential',
}

export const EntityDomainTypeName: Record<EntityDomainType, string> = {
  [EntityDomainType.IPFS]: 'IPFS',
  [EntityDomainType.Program]: 'Function',
  [EntityDomainType.Instance]: 'Instance',
  [EntityDomainType.Confidential]: 'Confidential',
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
  [EntityType.GpuInstance]: 'GPU Instance',
  [EntityType.SSHKey]: 'SSH Key',
  [EntityType.Domain]: 'Domain',
  [EntityType.Website]: 'Website',
  [EntityType.Confidential]: 'Confidential',
}

export const EntityTypeUrlSection: Record<EntityType, string> = {
  [EntityType.Volume]: 'storage',
  [EntityType.Program]: 'computing',
  [EntityType.Instance]: 'computing',
  [EntityType.GpuInstance]: 'computing',
  [EntityType.Confidential]: 'computing',
  [EntityType.SSHKey]: 'settings',
  [EntityType.Domain]: 'settings',
  [EntityType.Website]: 'hosting',
}

export const EntityTypeSlug: Record<EntityType, string> = {
  [EntityType.Volume]: 'volume',
  [EntityType.Program]: 'function',
  [EntityType.Instance]: 'instance',
  [EntityType.GpuInstance]: 'gpu-instance',
  [EntityType.SSHKey]: 'ssh',
  [EntityType.Domain]: 'domain',
  [EntityType.Website]: 'website',
  [EntityType.Confidential]: 'confidential',
}

export enum PaymentMethod {
  Hold = 'hold',
  Stream = 'stream',
}

export const superToken = '0x1290248E01ED2F9f863A9752A8aAD396ef3a1B00'

export enum WebsiteFrameworkId {
  none = 'none',
  nextjs = 'nextjs',
  react = 'react',
  vue = 'vue',
  /* gatsby = 'gatsby',
  svelte = 'svelte',
  nuxt = 'nuxt',
  angular = 'angular' */
}

export const EXTRA_WEI = 3600 / 10 ** 18
