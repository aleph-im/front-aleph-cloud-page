import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Confidential, ConfidentialStatus } from '@/domain/confidential'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { SSHKey } from '@/domain/ssh'
import { useRequestConfidentials } from '@/hooks/common/useRequestEntity/useRequestConfidentials'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { useAuthorization } from '@/hooks/common/authorization/useAuthorization'
import { DefaultTheme, useTheme } from 'styled-components'
import { useExecutableActions } from '@/hooks/common/useExecutableActions'
import { useConfidentialManager } from '@/hooks/common/useManager/useConfidentialManager'

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
    if (!authorized) push('/')
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
  const [mappedKeys, setMappedKeys] = useState<(SSHKey | undefined)[]>([])
  const sshKeyManager = useSSHKeyManager()

  useEffect(() => {
    if (!confidential || !sshKeyManager) return
    const getMapped = async () => {
      const mapped = await sshKeyManager?.getByValues(
        confidential.authorized_keys || [],
      )
      setMappedKeys(mapped)
    }

    getMapped()
  }, [sshKeyManager, confidential])

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
