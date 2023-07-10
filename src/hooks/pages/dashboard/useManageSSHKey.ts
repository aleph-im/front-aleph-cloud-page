import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { SSHKey } from '@/domain/ssh'
import { useAccountSSHKey } from '@/hooks/common/useAccountSSHKey'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useRequestState } from '@/hooks/common/useRequestState'
import { useSSHKeyManager } from '@/hooks/common/useSSHKeyManager'

export type ManageSSHKey = {
  sshKey?: SSHKey
  handleCopyLabel: () => void
  handleCopyKey: () => void
  handleDelete: () => void
}

export function useManageSSHKey(): ManageSSHKey {
  const router = useRouter()
  const { hash } = router.query

  const [sshKey] = useAccountSSHKey(hash as string)
  const [, { onLoad, onSuccess, onError }] = useRequestState()
  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const manager = useSSHKeyManager()

  const handleCopyLabel = useCallback(() => {
    copyAndNotify(sshKey?.label || '')
  }, [copyAndNotify, sshKey])

  const handleCopyKey = useCallback(() => {
    copyAndNotify(sshKey?.key || '')
  }, [copyAndNotify, sshKey])

  const handleDelete = useCallback(async () => {
    if (!sshKey) throw new Error('Invalid key')
    if (!manager) throw new Error('Manager not ready')

    try {
      onLoad()

      await manager.del(sshKey)

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [sshKey, onLoad, manager, onSuccess, router, onError])

  return {
    sshKey,
    handleCopyLabel,
    handleCopyKey,
    handleDelete,
  }
}
