import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { SSHKey } from '@/domain/ssh'
import { TabsProps, useCopyToClipboardAndNotify } from '@aleph-front/core'
import { DefaultTheme, useTheme } from 'styled-components'
import {
  UseExecutableActionsReturn,
  useExecutableActions,
} from '@/hooks/common/useExecutableActions'
import useFetchTermsAndConditions, {
  TermsAndConditions,
} from '@/hooks/common/useFetchTermsAndConditions'
import { useRequestGpuInstances } from '@/hooks/common/useRequestEntity/useRequestGpuInstances'
import { useGpuInstanceManager } from '@/hooks/common/useManager/useGpuInstanceManager'
import { GpuInstance } from '@/domain/gpuInstance'
import { useRequestSSHKeys } from '@/hooks/common/useRequestEntity/useRequestSSHKeys'

export type ManageGpuInstance = UseExecutableActionsReturn & {
  gpuInstance?: GpuInstance
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

export function useManageGpuInstance(): ManageGpuInstance {
  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestGpuInstances({ ids: hash as string })
  const [gpuInstance] = entities || []

  const manager = useGpuInstanceManager()

  const theme = useTheme()

  const [tabId, setTabId] = useState('detail')
  const subscribeLogs = tabId === 'log'

  const executableActions = useExecutableActions({
    executable: gpuInstance,
    manager,
    subscribeLogs,
  })

  const { logsDisabled, status } = executableActions

  const { termsAndConditions } = useFetchTermsAndConditions({
    termsAndConditionsMessageHash:
      gpuInstance?.requirements?.node?.terms_and_conditions,
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

  const handleCopyHash = useCopyToClipboardAndNotify(gpuInstance?.id || '')
  const handleCopyIpv6 = useCopyToClipboardAndNotify(status?.ipv6Parsed || '')
  const handleCopyConnect = useCopyToClipboardAndNotify(
    `ssh root@${status?.ipv6Parsed}`,
  )

  const { entities: sshKeys } = useRequestSSHKeys()

  const mappedKeys = useMemo(() => {
    if (!gpuInstance?.authorized_keys || !sshKeys) return []

    return gpuInstance.authorized_keys.map((value) =>
      sshKeys.find((d) => d.key === value),
    )
  }, [gpuInstance, sshKeys])

  const handleBack = () => {
    router.push('.')
  }
  return {
    ...executableActions,
    gpuInstance,
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
