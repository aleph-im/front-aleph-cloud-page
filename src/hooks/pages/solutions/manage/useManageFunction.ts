import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Program } from '@/domain/program'
import { useAccountFunction } from '@/hooks/common/useAccountEntity/useAccountFunction'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useProgramManager } from '@/hooks/common/useManager/useProgramManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'

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

  const [func] = useAccountFunction({ id: hash as string })
  const [, copyAndNotify] = useCopyToClipboardAndNotify()
  const [, dispatch] = useAppState()

  const manager = useProgramManager()

  const handleCopyHash = useCallback(() => {
    copyAndNotify(func?.id || '')
  }, [copyAndNotify, func])

  const handleDelete = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')
    if (!func) throw new Error('Invalid function')

    try {
      await manager.del(func)

      dispatch({
        type: ActionTypes.delAccountFunction,
        payload: { id: func.id },
      })

      router.replace('/solutions/dashboard')
    } catch (e) {}
  }, [manager, func, dispatch, router])

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
