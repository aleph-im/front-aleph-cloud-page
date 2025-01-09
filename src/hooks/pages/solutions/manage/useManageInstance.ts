import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Instance } from '@/domain/instance'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { SSHKey } from '@/domain/ssh'
import { useRequestInstances } from '@/hooks/common/useRequestEntity/useRequestInstances'
import { TabsProps, useCopyToClipboardAndNotify } from '@aleph-front/core'
import { DefaultTheme, useTheme } from 'styled-components'
import {
  UseExecutableActionsReturn,
  useExecutableActions,
} from '@/hooks/common/useExecutableActions'
import useFetchTermsAndConditions, {
  TermsAndConditions,
} from '@/hooks/common/useFetchTermsAndConditions'

export type ManageInstance = UseExecutableActionsReturn & {
  instance?: Instance
  termsAndConditions?: TermsAndConditions
  mappedKeys: (SSHKey | undefined)[]
  theme: DefaultTheme
  tabs: TabsProps['tabs']
  tabId: string
  setTabId: (tabId: string) => void
  handleCopyHash: () => void
  handleCopyConnect: () => void
  handleCopyIpv6: () => void
  handleBack: () => void
}

export function useManageInstance(): ManageInstance {
  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestInstances({ ids: hash as string })
  const [instance] = entities || []

  const manager = useInstanceManager()

  const theme = useTheme()

  const [tabId, setTabId] = useState('detail')
  const subscribeLogs = tabId === 'log'

  const executableActions = useExecutableActions({
    executable: instance,
    manager,
    subscribeLogs,
  })

  const { logsDisabled, status } = executableActions

  const { termsAndConditions } = useFetchTermsAndConditions({
    termsAndConditionsMessageHash:
      instance?.requirements?.node?.terms_and_conditions,
  })

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

  const [mappedKeys, setMappedKeys] = useState<(SSHKey | undefined)[]>([])

  const handleCopyHash = useCopyToClipboardAndNotify(instance?.id || '')
  const handleCopyIpv6 = useCopyToClipboardAndNotify(status?.ipv6Parsed || '')
  const handleCopyConnect = useCopyToClipboardAndNotify(
    `ssh root@${status?.ipv6Parsed}`,
  )

  const sshKeyManager = useSSHKeyManager()

  useEffect(() => {
    if (!instance || !sshKeyManager) return
    const getMapped = async () => {
      const mapped = await sshKeyManager?.getByValues(
        instance.authorized_keys || [],
      )
      setMappedKeys(mapped)
    }

    getMapped()
  }, [sshKeyManager, instance])

  const handleBack = () => {
    router.push('.')
  }
  return {
    ...executableActions,
    instance,
    termsAndConditions,
    mappedKeys,
    theme,
    tabs,
    tabId,
    setTabId,
    handleCopyHash,
    handleCopyConnect,
    handleCopyIpv6,
    handleBack,
  }
}
