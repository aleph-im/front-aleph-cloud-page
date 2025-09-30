// ------------------------ @todo: Refactor in domain package --------------------

import { ObjectImgProps } from '@aleph-front/core'

export const defaultAccountChannel = 'ALEPH-ACCOUNT'

// Default node ops message config
export const channel = 'FOUNDATION'
export const tags = ['mainnet']
export const postType = 'corechan-operation'

export const apiServer = 'http://51.159.106.166:4024'
export const wsServer = 'ws://51.159.106.166:4024'
export const mbPerAleph = 3

export const communityWalletAddress =
  '0x5aBd3258C5492fD378EBC2e0017416E199e5Da56'
export const scoringAddress = '0x4D52380D3191274a04846c89c069E6C3F2Ed94e4'
export const monitorAddress = '0xa1B3bb7d2332383D96b7796B908fB7f7F3c2Be10'
export const senderAddress = '0x3a5CC6aBd06B601f4654035d125F9DD2FC992C25'
export const erc20Address = '0x27702a26126e0B3702af63Ee09aC4d1A084EF628'
export const splTokenAddress = '3UCMiSnkcnkPE1pgQ5ggPCBv6dXgVUy16TmMUe1WpG9x'

export const crnListProgramUrl = 'https://crns-list.aleph.sh/crns.json'

export const websiteUrl = 'https://www.aleph.cloud'

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
export const defaultPortForwardingAggregateKey = 'port-forwarding'
export const defaultSSHPostType = 'ALEPH-SSH'

export const defaultConsoleChannel = 'ALEPH-CLOUDSOLUTIONS'

export const defaultVolumeChannel = defaultConsoleChannel
export const defaultSSHChannel = defaultConsoleChannel
export const defaultInstanceChannel = defaultConsoleChannel
export const defaultGpuInstanceChannel = defaultConsoleChannel
export const defaultConfidentialInstanceChannel = defaultConsoleChannel
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
  | 'allocate'
  | 'portForwarding'

type CheckoutDelStepType =
  | 'sshDel'
  | 'volumeDel'
  | 'domainDel'
  | 'streamDel'
  | 'instanceDel'
  | 'programDel'
  | 'websiteDel'
  | 'portForwardingDel'

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

export const EntityTypeObject: Record<EntityType, ObjectImgProps['id']> = {
  [EntityType.Volume]: 'Object15',
  [EntityType.Program]: 'Object10',
  [EntityType.Instance]: 'Object11',
  [EntityType.GpuInstance]: 'Object11',
  [EntityType.SSHKey]: 'Object21',
  [EntityType.Domain]: 'Object8',
  [EntityType.Website]: 'Object20',
  [EntityType.Confidential]: 'Object9',
}

export enum PaymentMethod {
  Hold = 'hold',
  Stream = 'stream',
  Credit = 'credit',
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

export const NAVIGATION_URLS = {
  legacyConsole: {
    home: 'https://app.aleph.cloud/console',
    settings: {
      home: 'https://app.aleph.cloud/console/settings',
      ssh: {
        home: 'https://app.aleph.cloud/console/settings/ssh',
        new: 'https://app.aleph.cloud/console/settings/ssh/new',
      },
      domain: {
        home: 'https://app.aleph.cloud/console/settings/domain',
        new: 'https://app.aleph.cloud/console/settings/domain/new',
      },
    },
    web3Hosting: {
      home: 'https://app.aleph.cloud/console/hosting/',
      website: {
        home: 'https://app.aleph.cloud/console/hosting/website',
        new: 'https://app.aleph.cloud/console/hosting/website/new',
      },
    },
    computing: {
      home: 'https://app.aleph.cloud/console/computing',
      functions: {
        home: 'https://app.aleph.cloud/console/computing/function',
        new: 'https://app.aleph.cloud/console/computing/function/new',
      },
      instances: {
        home: 'https://app.aleph.cloud/console/computing/instance',
        new: 'https://app.aleph.cloud/console/computing/instance/new',
      },
      gpus: {
        home: 'https://app.aleph.cloud/console/computing/gpu-instance',
        new: 'https://app.aleph.cloud/console/computing/gpu-instance/new',
      },
      confidentials: {
        home: 'https://app.aleph.cloud/console/computing/confidential',
        new: 'https://app.aleph.cloud/console/computing/confidential/new',
      },
    },
    storage: {
      home: 'https://app.aleph.cloud/console/storage',
      volumes: {
        home: 'https://app.aleph.cloud/console/storage/volume',
        new: 'https://app.aleph.cloud/console/storage/volume/new',
      },
    },
  },
  console: {
    home: '/console',
    settings: {
      home: '/console/settings',
      ssh: {
        home: '/console/settings/ssh',
        new: '/console/settings/ssh/new',
      },
      domain: {
        home: '/console/settings/domain',
        new: '/console/settings/domain/new',
      },
    },
    web3Hosting: {
      home: '/console/hosting',
      website: {
        home: '/console/hosting/website',
        new: '/console/hosting/website/new',
      },
    },
    computing: {
      home: '/console/computing',
      functions: {
        home: '/console/computing/function',
        new: '/console/computing/function/new',
      },
      instances: {
        home: '/console/computing/instance',
        new: '/console/computing/instance/new',
      },
      gpus: {
        home: '/console/computing/gpu-instance',
        new: '/console/computing/gpu-instance/new',
      },
      confidentials: {
        home: '/console/computing/confidential',
        new: '/console/computing/confidential/new',
      },
    },
    storage: {
      home: '/console/storage',
      volumes: {
        home: '/console/storage/volume',
        new: '/console/storage/volume/new',
      },
    },
  },
  account: {
    home: '/account',
    earn: {
      home: '/account/earn',
      staking: '/account/earn/staking',
      ccn: {
        home: '/account/earn/ccn',
        new: '/account/earn/ccn/new',
      },
      crn: {
        home: '/account/earn/crn',
        new: '/account/earn/crn/new',
      },
    },
  },
  error: {
    notFound: '/404',
  },
  explorer: { home: 'https://explorer.aleph.im' },
  swap: { home: 'https://swap.aleph.cloud' },
  docs: {
    home: 'https://docs.aleph.cloud',
    customDomains:
      'https://docs.aleph.cloud/devhub/deploying-and-hosting/custom-domains/setup.html',
    functions:
      'https://docs.aleph.cloud/devhub/compute-resources/functions/webconsole/',
    confidentials:
      'https://docs.aleph.cloud/devhub/compute-resources/confidential-instances/01-confidential-instance-introduction.html',
    immutableVolumes:
      'https://docs.aleph.cloud/devhub/building-applications/data-storage/types-of-storage/immutable-volume.html',
    cli: {
      home: 'https://docs.aleph.cloud/devhub/sdks-and-tools/aleph-cli/',
    },
  },
  external: {
    vrf: 'https://docs.aleph.cloud/devhub/tools/vrf/',
    indexingFramework:
      'https://docs.aleph.cloud/devhub/building-applications/blockchain-data/indexing/',
    rustCargo:
      'https://doc.rust-lang.org/cargo/getting-started/installation.html',
    sevctl: 'https://github.com/virtee/sevctl',
    openssh: 'https://www.openssh.com/',
    ipfsKubo: 'https://github.com/ipfs/kubo',
    guestmount: 'https://command-not-found.com/guestmount',
  },
}
