import { ExecutableStatus } from '@/domain/executable'

// Raw data input props
export type EntityConnectionMethodsProps = {
  executableStatus?: ExecutableStatus
}

// Formatted data returned by the hook
export type UseEntityConnectionMethodsReturn = {
  isLoading: boolean
  formattedIPv6: string
  formattedSSHCommand: string
  handleCopyIpv6: () => void
  handleCopyCommand: () => void
}
