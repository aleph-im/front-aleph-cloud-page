import { SSHKey } from '@/domain/ssh'
import { Domain } from '@/domain/domain'
import { useRequestSSHKeys } from '@/hooks/common/useRequestEntity/useRequestSSHKeys'
import { useRequestDomains } from '@/hooks/common/useRequestEntity/useRequestDomains'
import { useMemo, useState } from 'react'
import { TabsProps } from '@aleph-front/core'

export type UseSettingsDashboardPageReturn = {
  sshKeys: SSHKey[]
  domains: Domain[]
  tabs: TabsProps['tabs']
  tabId: string
  setTabId: (tab: string) => void
}

function getLabel(entities: unknown[], beta = false): string {
  const n = entities.length > 0 ? `(${entities.length})` : ''
  const b = beta ? 'BETA ' : ''
  return `${b}${n}`
}

export function useSettingsDashboardPage(): UseSettingsDashboardPageReturn {
  const { entities: sshKeys = [] } = useRequestSSHKeys()
  const { entities: domains = [] } = useRequestDomains()

  const [tabId, setTabId] = useState('ssh')

  const tabs: TabsProps['tabs'] = useMemo(() => {
    return [
      {
        id: 'ssh',
        name: 'SSH Keys',
        label: { label: getLabel(sshKeys), position: 'bottom' },
      },
      {
        id: 'domain',
        name: 'Domains',
        label: { label: getLabel(domains), position: 'bottom' },
      },
    ]
  }, [domains, sshKeys])

  return {
    sshKeys,
    domains,
    tabs,
    tabId,
    setTabId,
  }
}
