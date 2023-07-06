import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useAppState } from '@/contexts/appState'
import { Instance, InstanceManager } from '@/domain/instance'
import { useAccountInstance } from '@/hooks/common/useAccountInstance'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useRequestState } from '@/hooks/common/useRequestState'

export type ManageInstance = {
  instance?: Instance
  handleCopyHash: () => void
  handleDelete: () => void
  copyAndNotify: (text: string) => void
}

export function useManageInstance(): ManageInstance {
  const router = useRouter()
  const { hash } = router.query

  const [globalState] = useAppState()
  const [instance] = useAccountInstance(hash as string)
  const [, { onLoad, onSuccess, onError }] = useRequestState()

  const { account } = globalState

  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const handleCopyHash = useCallback(() => {
    copyAndNotify(instance?.id || '')
  }, [copyAndNotify, instance])

  const handleDelete = useCallback(async () => {
    if (!account) throw new Error('Invalid account')
    if (!instance) throw new Error('Invalid function')

    try {
      onLoad()

      const functionStore = new InstanceManager(account)
      await functionStore.del(instance)

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [account, instance, router, onError, onLoad, onSuccess])

  return {
    instance,
    handleCopyHash,
    handleDelete,
    copyAndNotify,
  }
}
