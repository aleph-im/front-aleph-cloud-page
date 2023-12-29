import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { SSHKey } from '@/domain/ssh'
import { useAccountSSHKey } from '@/hooks/common/useAccountEntity/useAccountSSHKey'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'

export type ManageSSHKey = {
  sshKey?: SSHKey
  handleCopyLabel: () => void
  handleCopyKey: () => void
  handleDelete: () => void
}

export function useManageSSHKey(): ManageSSHKey {
  const router = useRouter()
  const { hash } = router.query

  const [sshKey] = useAccountSSHKey({ id: hash as string })
  const [, copyAndNotify] = useCopyToClipboardAndNotify()
  const [, dispatch] = useAppState()

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
      await manager.del(sshKey)

      dispatch({
        type: ActionTypes.delAccountSSHKey,
        payload: { id: sshKey.id },
      })

      router.replace('/dashboard')
    } catch (e) {}
  }, [sshKey, manager, dispatch, router])

  return {
    sshKey,
    handleCopyLabel,
    handleCopyKey,
    handleDelete,
  }
}
