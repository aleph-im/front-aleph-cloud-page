import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Instance } from '@/domain/instance'
import { useAccountInstance } from '@/hooks/common/useAccountInstance'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useRequestState } from '@/hooks/common/useRequestState'
import { useInstanceManager } from '@/hooks/common/useInstanceManager'

export type ManageInstance = {
  instance?: Instance
  handleCopyHash: () => void
  handleDelete: () => void
  copyAndNotify: (text: string) => void
}

export function useManageInstance(): ManageInstance {
  const router = useRouter()
  const { hash } = router.query

  const [instance] = useAccountInstance(hash as string)
  const [, { onLoad, onSuccess, onError }] = useRequestState()
  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const manager = useInstanceManager()

  const handleCopyHash = useCallback(() => {
    copyAndNotify(instance?.id || '')
  }, [copyAndNotify, instance])

  const handleDelete = useCallback(async () => {
    if (!instance) throw new Error('Invalid function')
    if (!manager) throw new Error('Manager not ready')

    try {
      onLoad()

      await manager.del(instance)

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [instance, manager, onLoad, onSuccess, router, onError])

  return {
    instance,
    handleCopyHash,
    handleDelete,
    copyAndNotify,
  }
}
