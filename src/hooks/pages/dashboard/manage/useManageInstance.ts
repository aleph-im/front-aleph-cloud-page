import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Instance, InstanceStatus } from '@/domain/instance'
import { useAccountInstance } from '@/hooks/common/useAccountEntity/useAccountInstance'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useRequestState } from '@/hooks/common/useRequestState'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useInstanceStatus } from '@/hooks/common/useInstanceStatus'

export type ManageInstance = {
  instance?: Instance
  status?: InstanceStatus
  handleCopyHash: () => void
  handleCopyConnect: () => void
  handleDelete: () => void
  copyAndNotify: (text: string) => void
}

export function useManageInstance(): ManageInstance {
  const router = useRouter()
  const { hash } = router.query

  const [instance] = useAccountInstance({ id: hash as string })
  const [, { onLoad, onSuccess, onError }] = useRequestState()
  const [, copyAndNotify] = useCopyToClipboardAndNotify()
  const [, dispatch] = useAppState()

  const status = useInstanceStatus(instance)

  const manager = useInstanceManager()

  const handleCopyHash = useCallback(() => {
    copyAndNotify(instance?.id || '')
  }, [copyAndNotify, instance])

  const handleCopyConnect = useCallback(() => {
    copyAndNotify(`ssh root@${status?.vm_ipv6}`)
  }, [copyAndNotify, status])

  const handleDelete = useCallback(async () => {
    if (!instance) throw new Error('Invalid function')
    if (!manager) throw new Error('Manager not ready')

    try {
      onLoad()

      await manager.del(instance)

      dispatch({
        type: ActionTypes.delAccountInstance,
        payload: { id: instance.id },
      })

      onSuccess(true)

      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [instance, manager, onLoad, dispatch, onSuccess, router, onError])

  return {
    instance,
    status,
    handleCopyHash,
    handleCopyConnect,
    handleDelete,
    copyAndNotify,
  }
}
