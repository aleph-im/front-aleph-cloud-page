import { useMemo } from 'react'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import {
  EntityConnectionMethodsProps,
  UseEntityConnectionMethodsReturn,
} from './types'

/**
 * Hook for managing connection method data and actions
 * Handles formatting and clipboard operations
 */
export function useEntityConnectionMethods({
  executableStatus,
}: EntityConnectionMethodsProps): UseEntityConnectionMethodsReturn {
  // Check if data is still loading
  const isLoading = !executableStatus

  // Format the IPv6 address
  const formattedIPv6 = useMemo(() => {
    return executableStatus?.ipv6Parsed || ''
  }, [executableStatus?.ipv6Parsed])

  // Format the IPv4 address
  const formattedIPv4 = useMemo(() => {
    return executableStatus?.hostIpv4 || ''
  }, [executableStatus?.hostIpv4])

  // Format the SSH command
  const formattedSSHCommand = useMemo(() => {
    return `ssh root@${formattedIPv6}`
  }, [formattedIPv6])

  // Create clipboard handlers
  const handleCopyIpv4 = useCopyToClipboardAndNotify(formattedIPv4)
  const handleCopyIpv6 = useCopyToClipboardAndNotify(formattedIPv6)
  const handleCopyCommand = useCopyToClipboardAndNotify(formattedSSHCommand)

  return {
    isLoading,
    formattedIPv6,
    formattedIPv4,
    formattedSSHCommand,
    handleCopyIpv6,
    handleCopyIpv4,
    handleCopyCommand,
  }
}
