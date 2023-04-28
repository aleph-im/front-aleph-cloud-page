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

export const defaultVolumeChannel = 'ALEPH-VOLUME'

export const defaultVMChannel = 'ALEPH-CLOUDSOLUTIONS'

export const smallFooterPages = new Set([
  '/solutions/dashboard',
  '/solutions/dashboard/function',
  '/solutions/dashboard/manage',
])
