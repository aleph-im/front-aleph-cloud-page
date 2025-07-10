import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { Confidential, ConfidentialStatus } from '@/domain/confidential'
import { SSHKey } from '@/domain/ssh'
import { useRequestConfidentials } from '@/hooks/common/useRequestEntity/useRequestConfidentials'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { useAuthorization } from '@/hooks/common/authorization/useAuthorization'
import { DefaultTheme, useTheme } from 'styled-components'
import { useExecutableActions } from '@/hooks/common/useExecutableActions'
import { useConfidentialManager } from '@/hooks/common/useManager/useConfidentialManager'
import { NAVIGATION_URLS } from '@/helpers/constants'
import { useRequestSSHKeys } from '@/hooks/common/useRequestEntity/useRequestSSHKeys'

export type ManageConfidential = {
  authorized: boolean
  theme: DefaultTheme
  confidential?: Confidential
  status?: ConfidentialStatus
  mappedKeys: (SSHKey | undefined)[]
  nodeDetails?: { name: string; url: string }
  handleCopyHash: () => void
  handleCopyConnect: () => void
  handleCopyIpv6: () => void
  handleBack: () => void
}

export function useManageConfidential(): ManageConfidential {
  const theme = useTheme()
  const router = useRouter()
  const {
    push,
    query: { hash },
  } = router

  // Check if user is authorized
  const { confidentials: authorized } = useAuthorization()

  useEffect(() => {
    if (!authorized) push(NAVIGATION_URLS.console.home)
  }, [authorized, push])

  // ------------------
  // Fetch confidential instance data
  const { entities } = useRequestConfidentials({ ids: hash as string })
  const [confidential] = entities || []

  // ------------------
  // Load confidential instance actions
  const manager = useConfidentialManager()
  const executableActions = useExecutableActions({
    executable: confidential,
    manager,
    subscribeLogs: false,
  })

  const { status } = executableActions

  // ------------------
  // Load SSH keys

  const { entities: sshKeys } = useRequestSSHKeys()

  const mappedKeys = useMemo(() => {
    if (!confidential?.authorized_keys || !sshKeys) return []

    return confidential.authorized_keys.map((value) =>
      sshKeys.find((d) => d.key === value),
    )
  }, [confidential, sshKeys])

  // ------------------
  // Handlers

  const handleCopyHash = useCopyToClipboardAndNotify(confidential?.id || '')
  const handleCopyIpv6 = useCopyToClipboardAndNotify(status?.ipv6Parsed || '')
  const handleCopyConnect = useCopyToClipboardAndNotify(
    `ssh root@${status?.ipv6Parsed}`,
  )

  const handleBack = () => {
    push('.')
  }

  return {
    ...executableActions,
    authorized,
    theme,
    confidential,
    status,
    mappedKeys,
    handleCopyHash,
    handleCopyConnect,
    handleCopyIpv6,
    handleBack,
  }
}
