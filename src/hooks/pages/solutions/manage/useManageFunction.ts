import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { Program } from '@/domain/program'
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
  program?: Program
  handleDelete: () => void
  handleDownload: () => void
  handleCopyHash: () => void
  handleCopyRuntime: () => void
  handleCopyCode: () => void
}

export function useManageFunction(): ManageFunction {
  const [, dispatch] = useAppState()

  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestPrograms({ ids: hash as string })
  const [program] = entities || []

  const handleCopyHash = useCopyToClipboardAndNotify(program?.id || '')
  const handleCopyRuntime = useCopyToClipboardAndNotify(
    program?.runtime.ref || '',
  )
  const handleCopyCode = useCopyToClipboardAndNotify(program?.code.ref || '')

  const manager = useProgramManager()
  const { next, stop } = useCheckoutNotification({})

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
    program,
    handleDelete,
    handleDownload,
    handleCopyHash,
    handleCopyRuntime,
    handleCopyCode,
  }
}
