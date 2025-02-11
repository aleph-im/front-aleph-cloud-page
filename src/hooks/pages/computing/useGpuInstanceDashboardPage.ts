import { useMemo, useState } from 'react'
import { TabsProps } from '@aleph-front/core'
import { GpuInstance } from '@/domain/gpuInstance'
import { useRequestGpuInstances } from '@/hooks/common/useRequestEntity/useRequestGpuInstances'
import { useRequestGpuInstanceVolumes } from '@/hooks/common/useRequestEntity/useRequestGpuInstanceVolumes'
import { useRequestGpuInstanceDomains } from '@/hooks/common/useRequestEntity/useRequestGpuInstanceDomains'
import { Volume } from '@/domain/volume'
import { Domain } from '@/domain/domain'

export type UseGpuInstanceDashboardPageReturn = {
  gpuInstances: GpuInstance[]
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

export function useGpuInstanceDashboardPage(): UseGpuInstanceDashboardPageReturn {
  const { entities: gpuInstances = [] } = useRequestGpuInstances()
  const { entities: volumes = [] } = useRequestGpuInstanceVolumes()
  const { entities: domains = [] } = useRequestGpuInstanceDomains()

  const [tabId, setTabId] = useState('gpuInstances')

  console.log('gpuInstances', gpuInstances)
  console.log('volumes', volumes)
  console.log('domains', domains)

  const tabs: TabsProps['tabs'] = useMemo(() => {
    return [
      {
        id: 'gpuInstances',
        name: 'GPU Instances',
        label: { label: getLabel(gpuInstances), position: 'bottom' },
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
  }, [gpuInstances])

  return {
    gpuInstances,
    volumes,
    domains,
    tabs,
    tabId,
    setTabId,
  }
}
