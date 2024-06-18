import { useMemo, useState } from 'react'
import { TabsProps } from '@aleph-front/core'
import { useRequestWebsites } from '@/hooks/common/useRequestEntity/useRequestWebsites'
import { Website } from '@/domain/website'
import { useAppState } from '@/contexts/appState'

export type UseHostingWebsiteDashboardPageReturn = {
  websites: Website[]
  tabs: TabsProps['tabs']
  tabId: string
  setTabId: (tab: string) => void
}

function getLabel(entities: unknown[], beta = false): string {
  const n = entities.length > 0 ? `(${entities.length})` : ''
  const b = beta ? 'BETA ' : ''
  return `${b}${n}`
}

export function useHostingWebsiteDashboardPage(): UseHostingWebsiteDashboardPageReturn {
  const [state] = useAppState()
  const { account } = state.connection
  const triggerDeps = [account]

  const { entities: websites = [] } = useRequestWebsites({ triggerDeps })
  const [tabId, setTabId] = useState('website')

  const tabs: TabsProps['tabs'] = useMemo(
    () => [
      {
        id: 'website',
        name: 'Website',
        label: { label: getLabel(websites), position: 'bottom' },
      },
      {
        id: 'domain',
        name: 'Domains',
        label: { label: 'SOON', position: 'top' },
        disabled: true,
      },
    ],
    [websites],
  )

  return {
    websites,
    tabs,
    tabId,
    setTabId,
  }
}
