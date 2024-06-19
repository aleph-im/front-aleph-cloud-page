import { Volume } from '@/domain/volume'
import { useRequestVolumes } from '@/hooks/common/useRequestEntity/useRequestVolumes'
import { useMemo, useState } from 'react'
import { TabsProps } from '@aleph-front/core'

type AggregatedStorage = {
  totalStorage: number
  totalAmount: number
  linked: {
    storage: number
    amount: number
  }
  unlinked: {
    storage: number
    amount: number
  }
}

export type UseStorageDashboardPageReturn = {
  volumes: Volume[]
  volumesAggregatedStorage: AggregatedStorage
  tabs: TabsProps['tabs']
  tabId: string
  setTabId: (tab: string) => void
}

function getLabel(entities: unknown[], beta = false): string {
  const n = entities.length > 0 ? `(${entities.length})` : ''
  const b = beta ? 'BETA ' : ''
  return `${b}${n}`
}

function calculateEntitiesAggregatedStorage({
  entities,
}: {
  entities: Volume[]
}): AggregatedStorage {
  // TODO: implement linked/unlinked storage calculation
  return entities.reduce(
    (ac, cv) => {
      ac.totalStorage += cv.size || 0
      ac.totalAmount += 1
      return ac
    },
    {
      totalStorage: 0,
      totalAmount: 0,
      linked: {
        storage: 0,
        amount: 0,
      },
      unlinked: {
        storage: 0,
        amount: 0,
      },
    },
  )
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
      {
        id: 'persistent-storage',
        name: 'Persistent Storage',
        label: { label: 'SOON', position: 'top' },
        disabled: true,
      },
    ]
  }, [volumes])

  const volumesAggregatedStorage = useMemo(() => {
    return calculateEntitiesAggregatedStorage({ entities: volumes })
  }, [volumes])

  return {
    volumes,
    volumesAggregatedStorage,
    tabs,
    tabId,
    setTabId,
  }
}
