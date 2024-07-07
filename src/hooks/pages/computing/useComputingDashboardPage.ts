import { TabsProps } from '@aleph-front/core'
import { Instance } from '@/domain/instance'
import { Program } from '@/domain/program'
import { useRequestInstances } from '@/hooks/common/useRequestEntity/useRequestInstances'
import { useRequestPrograms } from '@/hooks/common/useRequestEntity/useRequestPrograms'
import { useMemo, useState } from 'react'

export type UseComputingDashboardPageReturn = {
  instances: Instance[]
  programs: Program[]
  tabs: TabsProps['tabs']
  tabId: string
  setTabId: (tab: string) => void
}

function getLabel(entities: unknown[], beta = false): string {
  const n = entities.length > 0 ? `(${entities.length})` : ''
  const b = beta ? 'BETA ' : ''
  return `${b}${n}`
}

export function useComputingDashboardPage(): UseComputingDashboardPageReturn {
  const { entities: instances = [] } = useRequestInstances()
  const { entities: programs = [] } = useRequestPrograms()

  const [tabId, setTabId] = useState('instance')

  const tabs: TabsProps['tabs'] = useMemo(() => {
    return [
      {
        id: 'instance',
        name: 'Instance',
        label: { label: getLabel(instances), position: 'bottom' },
      },
      {
        id: 'program',
        name: 'Function',
        label: { label: getLabel(programs), position: 'bottom' },
      },
    ]
  }, [programs, instances])

  return {
    instances,
    programs,
    tabs,
    tabId,
    setTabId,
  }
}
