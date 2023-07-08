import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useAppState } from '@/contexts/appState'
import { SSHKey, SSHKeyManager } from '@/domain/ssh'
import { useAccountSSHKey } from '@/hooks/common/useAccountSSHKey'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useRequestState } from '@/hooks/common/useRequestState'

export type ManageSSHKey = {
  sshKey?: SSHKey
  handleCopyLabel: () => void
  handleCopyKey: () => void
  handleDelete: () => void
}

export function useManageSSHKey(): ManageSSHKey {
  const router = useRouter()
  const { hash } = router.query

  const [globalState] = useAppState()
  const [sshKey] = useAccountSSHKey(hash as string)
  const [, { onLoad, onSuccess, onError }] = useRequestState()

  const { account } = globalState

  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const handleCopyLabel = useCallback(() => {
    copyAndNotify(sshKey?.label || '')
  }, [copyAndNotify, sshKey])

  const handleCopyKey = useCallback(() => {
    copyAndNotify(sshKey?.key || '')
  }, [copyAndNotify, sshKey])

  const handleDelete = useCallback(async () => {
    if (!account) throw new Error('Invalid account')
    if (!sshKey) throw new Error('Invalid key')

    try {
      onLoad()

      const sshKeyStore = new SSHKeyManager(account)
      await sshKeyStore.del(sshKey)

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [account, sshKey, router, onError, onLoad, onSuccess])

  return {
    sshKey,
    handleCopyLabel,
    handleCopyKey,
    handleDelete,
  }
}
