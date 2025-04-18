import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import {
  LabelProps,
  TabsProps,
  useCopyToClipboardAndNotify,
} from '@aleph-front/core'
import { Program } from '@/domain/program'
import { useProgramManager } from '@/hooks/common/useManager/useProgramManager'
import { useRequestPrograms } from '@/hooks/common/useRequestEntity/useRequestPrograms'
import Err from '@/helpers/errors'
import {
  UseExecutableActionsReturn,
  useExecutableActions,
} from '@/hooks/common/useExecutableActions'
import { ellipseAddress } from '@/helpers/utils'

export type ManageFunction = UseExecutableActionsReturn & {
  // Basic data
  program?: Program
  name: string
  labelVariant: LabelProps['variant']
  isPersistent: boolean

  // program?: Program
  tabs: TabsProps['tabs']
  tabId: string

  // Actions
  setTabId: (tabId: string) => void
  handleDownload: () => void
  handleCopyHash: () => void
  handleCopyRuntime: () => void
  handleCopyCode: () => void
  handleBack: () => void
}

export function useManageFunction(): ManageFunction {
  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestPrograms({ ids: hash as string })
  const [program] = entities || []

  const programManager = useProgramManager()

  const [tabId, setTabId] = useState('detail')
  const subscribeLogs = tabId === 'log'

  const executableActions = useExecutableActions({
    executable: program,
    manager: programManager,
    subscribeLogs,
  })

  const { logsDisabled } = executableActions

  const isPersistent = useMemo(() => !!program?.on.persistent, [program])

  const isAllocated = useMemo(
    () => (isPersistent ? executableActions.isAllocated : !!program?.confirmed),
    [executableActions, program, isPersistent],
  )

  // Format program name
  const name = useMemo(() => {
    if (!program) return ''
    return (program?.metadata?.name as string) || ellipseAddress(program.id)
  }, [program])

  // Calculate label variant
  const labelVariant = useMemo(() => {
    if (!program) return 'warning'

    return program.time < Date.now() - 1000 * 45 && isAllocated
      ? 'success'
      : 'warning'
  }, [program, isAllocated])

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
    if (!programManager) throw Err.ConnectYourWallet
    if (!program) throw Err.FunctionNotFound

    await programManager.download(program)
  }, [programManager, program])

  const handleBack = () => {
    router.push('.')
  }

  return {
    ...executableActions,
    isPersistent,
    isAllocated,
    program,
    name,
    labelVariant,
    tabs,
    tabId,
    setTabId,
    handleDownload,
    handleCopyHash,
    handleCopyRuntime,
    handleCopyCode,
    handleBack,
  }
}
