import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { SSHKey } from '@/domain/ssh'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { useAppState } from '@/contexts/appState'
import { useRequestSSHKeys } from '@/hooks/common/useRequestEntity/useRequestSSHKeys'
import { EntityDelAction } from '@/store/entity'

export type ManageSSHKey = {
  sshKey?: SSHKey
  handleCopyLabel: () => void
  handleCopyKey: () => void
  handleDelete: () => void
}

export function useManageSSHKey(): ManageSSHKey {
  const [, dispatch] = useAppState()

  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestSSHKeys({ id: hash as string })
  const [sshKey] = entities || []

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
      await manager.del(sshKey)

      dispatch(new EntityDelAction({ name: 'ssh', keys: [sshKey.id] }))

      await router.replace('/')
    } catch (e) {}
  }, [sshKey, manager, dispatch, router])

  return {
    sshKey,
    handleCopyLabel,
    handleCopyKey,
    handleDelete,
  }
}
