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

export const defaultSSHPostType = 'ALEPH-SSH'

export const defaultConsoleChannel = 'ALEPH-CLOUDSOLUTIONS'

export const defaultVolumeChannel = defaultConsoleChannel
export const defaultSSHChannel = defaultConsoleChannel
export const defaultInstanceChannel = defaultConsoleChannel
export const defaultProgramChannel = defaultConsoleChannel

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
}

export const EntityTypeName: Record<EntityType, string> = {
  [EntityType.Volume]: 'Volume',
  [EntityType.Program]: 'Function',
  [EntityType.Instance]: 'Instance',
  [EntityType.SSHKey]: 'SSH Key',
}
