import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Program } from '@/domain/program'
import { useAccountFunction } from '@/hooks/common/useAccountFunction'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useRequestState } from '@/hooks/common/useRequestState'
import { useProgramManager } from '@/hooks/common/useProgramManager'

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

  const [func] = useAccountFunction(hash as string)
  const [, { onLoad, onSuccess, onError }] = useRequestState()
  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const manager = useProgramManager()

  const handleCopyHash = useCallback(() => {
    copyAndNotify(func?.id || '')
  }, [copyAndNotify, func])

  const handleDelete = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')
    if (!func) throw new Error('Invalid function')

    try {
      onLoad()

      await manager.del(func)

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [manager, func, router, onError, onLoad, onSuccess])

  const handleDownload = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')
    if (!func) throw new Error('Invalid function')

    await manager.download(func)
  }, [manager, func])

  return {
    func,
    handleCopyHash,
    handleDelete,
    handleDownload,
    copyAndNotify,
  }
}
