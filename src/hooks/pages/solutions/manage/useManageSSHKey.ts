import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { SSHKey } from '@/domain/ssh'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { useAppState } from '@/contexts/appState'
import { useRequestSSHKeys } from '@/hooks/common/useRequestEntity/useRequestSSHKeys'
import { EntityDelAction } from '@/store/entity'
import Err from '@/helpers/errors'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'

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

  const { entities } = useRequestSSHKeys({ ids: hash as string })
  const [sshKey] = entities || []

  const handleCopyLabel = useCopyToClipboardAndNotify(sshKey?.label || '')
  const handleCopyKey = useCopyToClipboardAndNotify(sshKey?.key || '')

  const manager = useSSHKeyManager()
  const { next, stop } = useCheckoutNotification({})

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!sshKey) throw Err.SSHKeyNotFound

    const iSteps = await manager.getDelSteps(sshKey)
    const nSteps = iSteps.map((i) => stepsCatalog[i])
    const steps = manager.delSteps(sshKey)

    try {
      while (true) {
        const { done } = await steps.next()
        if (done) {
          break
        }
        await next(nSteps)
      }

      dispatch(new EntityDelAction({ name: 'ssh', keys: [sshKey.id] }))

      await router.replace('/')
    } catch (e) {
    } finally {
      await stop()
    }
  }, [dispatch, manager, sshKey, next, router, stop])

  return {
    sshKey,
    handleCopyLabel,
    handleCopyKey,
    handleDelete,
  }
}
