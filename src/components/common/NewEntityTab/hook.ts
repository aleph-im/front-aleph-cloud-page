import Router from 'next/router'
import { useCallback } from 'react'
import { NAVIGATION_URLS } from '@/helpers/constants'

export type NewEntityTabId =
  | 'instance'
  | 'function'
  | 'gpu-instance'
  | 'confidential'

export type UseNewEntityTabProps = {
  selected: NewEntityTabId
}

export type UseNewEntityTab = UseNewEntityTabProps & {
  handleChange: (id: string) => void
}

const entityRoutes: Record<NewEntityTabId, string> = {
  instance: NAVIGATION_URLS.console.computing.instances.new,
  function: NAVIGATION_URLS.console.computing.functions.new,
  'gpu-instance': NAVIGATION_URLS.console.computing.gpus.new,
  confidential: NAVIGATION_URLS.console.computing.confidentials.new,
}

export function useNewEntityTab(props: UseNewEntityTabProps): UseNewEntityTab {
  const handleChange = useCallback((id: string) => {
    const route = entityRoutes[id as NewEntityTabId]
    if (route) {
      Router.push(route)
    }
  }, [])

  return {
    ...props,
    handleChange,
  }
}
