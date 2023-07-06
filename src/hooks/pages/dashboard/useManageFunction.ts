import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useAppState } from '@/contexts/appState'
import { Program, ProgramManager } from '@/domain/program'
import { useAccountFunction } from '@/hooks/common/useAccountFunction'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useRequestState } from '@/hooks/common/useRequestState'

export type ManageFunction = {
  func?: Program
  handleCopyHash: () => void
  handleDelete: () => void
  handleDownload: () => void
  copyAndNotify: (text: string) => void
}

export function useManageFunction(): ManageFunction {
  const router = useRouter()
  const { hash } = router.query

  const [globalState] = useAppState()
  const [func] = useAccountFunction(hash as string)
  const [, { onLoad, onSuccess, onError }] = useRequestState()

  const { account } = globalState

  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const handleCopyHash = useCallback(() => {
    copyAndNotify(func?.id || '')
  }, [copyAndNotify, func])

  const handleDelete = useCallback(async () => {
    if (!account) throw new Error('Invalid account')
    if (!func) throw new Error('Invalid function')

    try {
      onLoad()

      const functionStore = new ProgramManager(account)
      await functionStore.del(func)

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [account, func, router, onError, onLoad, onSuccess])

  const handleDownload = useCallback(async () => {
    if (!account) throw new Error('Invalid account')
    if (!func) throw new Error('Invalid function')

    const functionStore = new ProgramManager(account)
    await functionStore.download(func)
  }, [account, func])

  return {
    func,
    handleCopyHash,
    handleDelete,
    handleDownload,
    copyAndNotify,
  }
}
