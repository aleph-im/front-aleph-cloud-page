import { useMemo, useState } from 'react'
import { TabsProps } from '@aleph-front/core'
import { Instance } from '@/domain/instance'
import { useRequestInstances } from '@/hooks/common/useRequestEntity/useRequestInstances'
import { Volume } from '@/domain/volume'
import { useRequestInstanceVolumes } from '@/hooks/common/useRequestEntity/useRequestInstanceVolumes'
import { useRequestInstanceDomains } from '@/hooks/common/useRequestEntity/useRequestInstanceDomains'
import { Domain } from '@/domain/domain'

export type UseInstanceDashboardPageReturn = {
  instances: Instance[]
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

export function useInstanceDashboardPage(): UseInstanceDashboardPageReturn {
  const { entities: instances = [] } = useRequestInstances()
  const { entities: volumes = [] } = useRequestInstanceVolumes()
  const { entities: domains = [] } = useRequestInstanceDomains()

  const [tabId, setTabId] = useState('instance')

  const tabs: TabsProps['tabs'] = useMemo(() => {
    return [
      {
        id: 'instance',
        name: 'Instances',
        label: { label: getLabel(instances), position: 'bottom' },
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
  }, [domains, instances, volumes])

  return {
    instances,
    volumes,
    domains,
    tabs,
    tabId,
    setTabId,
  }
}
