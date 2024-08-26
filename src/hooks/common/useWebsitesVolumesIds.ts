import { useMemo, useState } from 'react'
import { useAppState } from '@/contexts/appState'

export type useWebsitesVolumesIdsReturn = string[]

export function useWebsitesVolumesIds(): useWebsitesVolumesIdsReturn {
  const [ids, setIds] = useState<string[]>([])

  const [state] = useAppState()
  const websites = state.website.entities

  useMemo(() => {
    if (!websites) return setIds([])

    setIds(websites.flatMap((website) => website.volume_id))
  }, [websites])

  return ids
}
