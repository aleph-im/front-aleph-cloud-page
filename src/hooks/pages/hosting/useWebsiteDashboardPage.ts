import { useMemo, useState } from 'react'
import { TabsProps } from '@aleph-front/core'
import { Website } from '@/domain/website'
import { useRequestWebsites } from '@/hooks/common/useRequestEntity/useRequestWebsites'
import { useRequestWebsiteDomains } from '@/hooks/common/useRequestEntity/useRequestWebsiteDomains'
import { Domain } from '@/domain/domain'

export type UseWebsiteDashboardPageReturn = {
  websites: Website[]
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

export function useWebsiteDashboardPage(): UseWebsiteDashboardPageReturn {
  const { entities: websites = [] } = useRequestWebsites()
  const { entities: domains = [] } = useRequestWebsiteDomains()

  const [tabId, setTabId] = useState('website')

  const tabs: TabsProps['tabs'] = useMemo(() => {
    return [
      {
        id: 'website',
        name: 'Websites',
        label: { label: getLabel(websites), position: 'bottom' },
      },
      {
        id: 'domain',
        name: 'Linked Domains',
        label: { label: getLabel(domains), position: 'bottom' },
        disabled: !domains.length,
      },
    ]
  }, [websites, domains])

  return {
    websites,
    domains,
    tabs,
    tabId,
    setTabId,
  }
}
