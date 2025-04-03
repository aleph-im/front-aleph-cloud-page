import Router from 'next/router'
import { useCallback } from 'react'

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

export function useNewEntityTab(props: UseNewEntityTabProps): UseNewEntityTab {
  const handleChange = useCallback((id: string) => {
    Router.push(`/computing/${id}/new`)
  }, [])

  return {
    ...props,
    handleChange,
  }
}
