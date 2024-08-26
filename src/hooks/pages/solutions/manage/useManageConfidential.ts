import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Confidential, ConfidentialStatus } from '@/domain/confidential'
import { useConfidentialStatus } from '@/hooks/common/useConfidentialStatus'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { SSHKey } from '@/domain/ssh'
import { PaymentType } from '@aleph-sdk/message'
import { useRequestConfidentials } from '@/hooks/common/useRequestEntity/useRequestConfidentials'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'
import { CRN } from '@/domain/node'
import { useAuthorization } from '@/hooks/common/authorization/useAuthorization'
import { DefaultTheme, useTheme } from 'styled-components'

export type ManageConfidential = {
  authorized: boolean
  theme: DefaultTheme
  confidential?: Confidential
  status?: ConfidentialStatus
  mappedKeys: (SSHKey | undefined)[]
  crn?: CRN
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

  const { confidentials: authorized } = useAuthorization()

  useEffect(() => {
    if (!authorized) push('/')
  }, [authorized, push])

  const { entities } = useRequestConfidentials({ ids: hash as string })
  const [confidential] = entities || []

  const [mappedKeys, setMappedKeys] = useState<(SSHKey | undefined)[]>([])
  const status = useConfidentialStatus(confidential)

  const handleCopyHash = useCopyToClipboardAndNotify(confidential?.id || '')
  const handleCopyIpv6 = useCopyToClipboardAndNotify(status?.vm_ipv6 || '')
  const handleCopyConnect = useCopyToClipboardAndNotify(
    `ssh root@${status?.vm_ipv6}`,
  )

  const nodeManager = useNodeManager()
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

  const [crn, setCRN] = useState<CRN>()

  useEffect(() => {
    async function load() {
      try {
        if (!nodeManager) throw new Error()
        if (!confidential) throw new Error()
        if (confidential.payment?.type !== PaymentType.superfluid)
          throw new Error()

        const { receiver } = confidential.payment || {}
        if (!receiver) throw new Error()

        const node = await nodeManager.getCRNByStreamRewardAddress(receiver)
        setCRN(node)
      } catch {
        setCRN(undefined)
      }
    }
    load()
  }, [confidential, nodeManager])

  const nodeDetails = useMemo(() => {
    if (status?.node) {
      return {
        name: status.node.node_id,
        url: status.node.url,
      }
    }
    if (crn) {
      return {
        name: crn.name || crn.hash,
        url: crn.address || '',
      }
    }
  }, [crn, status?.node])

  const handleBack = () => {
    push('.')
  }

  return {
    authorized,
    theme,
    confidential,
    status,
    mappedKeys,
    crn,
    nodeDetails,
    handleCopyHash,
    handleCopyConnect,
    handleCopyIpv6,
    handleBack,
  }
}
