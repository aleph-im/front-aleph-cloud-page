import { Volume } from '@/domain/volume'
import { useMemo, useState } from 'react'
import { TabsProps } from '@aleph-front/core'
import {
  UseAttachedVolumesReturn,
  useAttachedVolumes,
} from '@/hooks/common/useAttachedVolumes'
import { useAccountEntities } from '@/hooks/common/useAccountEntities'

export type UseStorageDashboardPageReturn = {
  volumes: Volume[]
  volumesAggregatedStorage: UseAttachedVolumesReturn
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
  const { programs, instances, websites, volumes } = useAccountEntities()

  const [tabId, setTabId] = useState('volume')

  const tabs: TabsProps['tabs'] = useMemo(() => {
    return [
      {
        id: 'volume',
        name: 'Volumes',
        label: { label: getLabel(volumes), position: 'bottom' },
      },
      {
        id: 'persistent-storage',
        name: 'Persistent Storage',
        label: { label: 'SOON', position: 'top' },
        disabled: true,
      },
    ]
  }, [volumes])

  const volumesAggregatedStorage = useAttachedVolumes({
    programs,
    instances,
    websites,
    volumes,
  })

  return {
    volumes,
    volumesAggregatedStorage,
    tabs,
    tabId,
    setTabId,
  }
}
