import { Volume } from '@/domain/volume'
import { useRequestVolumes } from '@/hooks/common/useRequestEntity/useRequestVolumes'
import { useMemo, useState } from 'react'
import { TabsProps } from '@aleph-front/core'

export type UseStorageDashboardPageReturn = {
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

export function useStorageDashboardPage(): UseStorageDashboardPageReturn {
  const { entities: volumes = [] } = useRequestVolumes()

  const [tabId, setTabId] = useState('volume')

  const tabs: TabsProps['tabs'] = useMemo(() => {
    return [
      {
        id: 'volume',
        name: 'Volumes',
        label: { label: getLabel(volumes), position: 'bottom' },
      },
    ]
  }, [volumes])

  return {
    volumes,
    tabs,
    tabId,
    setTabId,
  }
}
