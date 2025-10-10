import { ExecutableStatus } from '@/domain/executable'

// Raw data input props
export type EntityConnectionMethodsProps = {
  executableStatus?: ExecutableStatus
  sshForwardedPort?: string
}

// Formatted data returned by the hook
export type UseEntityConnectionMethodsReturn = {
  isLoading: boolean
  formattedIPv6: string
  formattedIPv4: string
  formattedIpv4SSHCommand: string
  formattedIpv6SSHCommand: string
  handleCopyIpv6: () => void
  handleCopyIpv4: () => void
  handleCopyIpv4Command: () => void
  handleCopyIpv6Command: () => void
}
