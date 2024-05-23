import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Program } from '@/domain/program'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useProgramManager } from '@/hooks/common/useManager/useProgramManager'
import { useAppState } from '@/contexts/appState'
import { useRequestPrograms } from '@/hooks/common/useRequestEntity/useRequestPrograms'
import { EntityDelAction } from '@/store/entity'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import Err from '@/helpers/errors'

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
  const { next, stop } = useCheckoutNotification({})

  const handleCopyHash = useCallback(() => {
    copyAndNotify(program?.id || '')
  }, [copyAndNotify, program])

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!program) throw Err.FunctionNotFound

    const iSteps = await manager.getDelSteps(program)
    const nSteps = iSteps.map((i) => stepsCatalog[i])
    const steps = manager.delSteps(program)

    try {
      while (true) {
        const { done } = await steps.next()
        if (done) {
          break
        }
        await next(nSteps)
      }

      dispatch(new EntityDelAction({ name: 'program', keys: [program.id] }))

      await router.replace('/')
    } catch (e) {
    } finally {
      await stop()
    }
  }, [manager, program, dispatch, router, next, stop])

  const handleDownload = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!program) throw Err.FunctionNotFound

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
