import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { TabsProps, useCopyToClipboardAndNotify } from '@aleph-front/core'
import { Program } from '@/domain/program'
import { useProgramManager } from '@/hooks/common/useManager/useProgramManager'
import { useRequestPrograms } from '@/hooks/common/useRequestEntity/useRequestPrograms'
import Err from '@/helpers/errors'
import {
  UseExecutableActionsReturn,
  useExecutableActions,
} from '@/hooks/common/useExecutableActions'

export type ManageFunction = UseExecutableActionsReturn & {
  program?: Program
  tabs: TabsProps['tabs']
  tabId: string
  isPersistent: boolean
  setTabId: (tabId: string) => void
  handleDownload: () => void
  handleCopyHash: () => void
  handleCopyRuntime: () => void
  handleCopyCode: () => void
}

export function useManageFunction(): ManageFunction {
  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestPrograms({ ids: hash as string })
  const [program] = entities || []

  const manager = useProgramManager()

  const [tabId, setTabId] = useState('detail')
  const subscribeLogs = tabId === 'log'

  const executableActions = useExecutableActions({
    executable: program,
    manager,
    subscribeLogs,
  })

  const { logsDisabled } = executableActions

  const tabs = useMemo(
    () =>
      [
        {
          id: 'detail',
          name: 'Details',
        },
        {
          id: 'log',
          name: 'Logs',
          disabled: logsDisabled,
        },
      ] as TabsProps['tabs'],
    [logsDisabled],
  )

  const handleCopyHash = useCopyToClipboardAndNotify(program?.id || '')
  const handleCopyRuntime = useCopyToClipboardAndNotify(
    program?.runtime.ref || '',
  )
  const handleCopyCode = useCopyToClipboardAndNotify(program?.code.ref || '')

  const handleDownload = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!program) throw Err.FunctionNotFound

    await manager.download(program)
  }, [manager, program])

  const isPersistent = !!program?.on.persistent

  const isRunning = isPersistent
    ? executableActions.isRunning
    : !!program?.confirmed

  return {
    ...executableActions,
    isPersistent,
    isRunning,
    program,
    tabs,
    tabId,
    setTabId,
    handleDownload,
    handleCopyHash,
    handleCopyRuntime,
    handleCopyCode,
  }
}
