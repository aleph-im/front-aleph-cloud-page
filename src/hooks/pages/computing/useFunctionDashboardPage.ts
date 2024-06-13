import { useMemo, useState } from 'react'
import { TabsProps } from '@aleph-front/core'
import { Program } from '@/domain/program'
import { useRequestPrograms } from '@/hooks/common/useRequestEntity/useRequestPrograms'
import { useRequestVolumes } from '@/hooks/common/useRequestEntity/useRequestVolumes'
import { Volume } from '@/domain/volume'
import { useAttachedVolumes } from './useAttachedVolumes'

export type UseFunctionDashboardPageReturn = {
  programs: Program[]
  volumes: Volume[]
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
  const { entities: allVolumes = [] } = useRequestVolumes()

  const { volumes } = useAttachedVolumes({
    volumes: allVolumes,
    programs,
  })

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
    ]
  }, [programs, volumes])

  return {
    programs,
    volumes,
    tabs,
    tabId,
    setTabId,
  }
}
