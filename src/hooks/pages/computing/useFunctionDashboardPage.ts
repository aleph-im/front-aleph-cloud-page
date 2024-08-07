import { useMemo, useState } from 'react'
import { TabsProps } from '@aleph-front/core'
import { Program } from '@/domain/program'
import { useRequestPrograms } from '@/hooks/common/useRequestEntity/useRequestPrograms'
import { Volume } from '@/domain/volume'
import { useRequestProgramVolumes } from '@/hooks/common/useRequestEntity/useRequestProgramVolumes'
import { useRequestProgramDomains } from '@/hooks/common/useRequestEntity/useRequestProgramDomains'
import { Domain } from '@/domain/domain'

export type UseFunctionDashboardPageReturn = {
  programs: Program[]
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

export function useFunctionDashboardPage(): UseFunctionDashboardPageReturn {
  const { entities: programs = [] } = useRequestPrograms()
  const { entities: volumes = [] } = useRequestProgramVolumes()
  const { entities: domains = [] } = useRequestProgramDomains()

  const [tabId, setTabId] = useState('program')

  const tabs: TabsProps['tabs'] = useMemo(() => {
    return [
      {
        id: 'program',
        name: 'Functions',
        label: { label: getLabel(programs), position: 'bottom' },
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
  }, [domains, programs, volumes])

  return {
    programs,
    volumes,
    domains,
    tabs,
    tabId,
    setTabId,
  }
}
