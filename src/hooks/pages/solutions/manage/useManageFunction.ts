import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Program } from '@/domain/program'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useProgramManager } from '@/hooks/common/useManager/useProgramManager'
import { useAppState } from '@/contexts/appState'
import { useRequestPrograms } from '@/hooks/common/useRequestEntity/useRequestPrograms'
import { EntityDelAction } from '@/store/entity'

export type ManageFunction = {
  func?: Program
  handleCopyHash: () => void
  handleDelete: () => void
  handleDownload: () => void
  copyAndNotify: (text: string) => void
}

export function useManageFunction(): ManageFunction {
  const [, dispatch] = useAppState()

  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestPrograms({ id: hash as string })
  const [program] = entities || []

  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const manager = useProgramManager()

  const handleCopyHash = useCallback(() => {
    copyAndNotify(program?.id || '')
  }, [copyAndNotify, program])

  const handleDelete = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')
    if (!program) throw new Error('Invalid function')

    try {
      await manager.del(program)

      dispatch(new EntityDelAction({ name: 'program', keys: [program.id] }))

      await router.replace('/')
    } catch (e) {}
  }, [manager, program, dispatch, router])

  const handleDownload = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')
    if (!program) throw new Error('Invalid function')

    await manager.download(program)
  }, [manager, program])

  return {
    func: program,
    handleCopyHash,
    handleDelete,
    handleDownload,
    copyAndNotify,
  }
}
