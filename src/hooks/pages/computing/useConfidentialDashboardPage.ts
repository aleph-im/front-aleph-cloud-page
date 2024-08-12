import { useMemo, useState } from 'react'
import { TabsProps } from '@aleph-front/core'
import { Volume } from '@/domain/volume'
import { useRequestInstanceVolumes } from '@/hooks/common/useRequestEntity/useRequestInstanceVolumes'
import { useRequestInstanceDomains } from '@/hooks/common/useRequestEntity/useRequestInstanceDomains'
import { Domain } from '@/domain/domain'
import { useRequestConfidentials } from '@/hooks/common/useRequestEntity/useRequestConfidentials'
import { Confidential } from '@/domain/confidential'
import { useRequestConfidentialVolumes } from '@/hooks/common/useRequestEntity/useRequestConfidentialVolumes'
import { useRequestConfidentialDomains } from '@/hooks/common/useRequestEntity/useRequestConfidentialDomains'

export type UseConfidentialDashboardPageReturn = {
  confidentials: Confidential[]
  volumes: Volume[]
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

export function useConfidentialDashboardPage(): UseConfidentialDashboardPageReturn {
  const { entities: confidentials = [] } = useRequestConfidentials()
  const { entities: volumes = [] } = useRequestConfidentialVolumes()
  const { entities: domains = [] } = useRequestConfidentialDomains()

  const [tabId, setTabId] = useState('confidential')

  const tabs: TabsProps['tabs'] = useMemo(() => {
    return [
      {
        id: 'confidential',
        name: 'Confidentials',
        label: { label: getLabel(confidentials), position: 'bottom' },
      },
      {
        id: 'volume',
        name: 'Attached Volumes',
        label: { label: getLabel(volumes), position: 'bottom' },
        disabled: !volumes.length,
      },
      {
        id: 'domain',
        name: 'Linked Domains',
        label: { label: getLabel(domains), position: 'bottom' },
        disabled: !domains.length,
      },
    ]
  }, [domains, confidentials, volumes])

  return {
    confidentials,
    volumes,
    domains,
    tabs,
    tabId,
    setTabId,
  }
}
