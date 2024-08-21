import { useMemo, useState } from 'react'
import { useAppState } from '@/contexts/appState'
import { ImmutableVolume } from '@aleph-sdk/message'

export type useInstancesVolumesIdsReturn = string[]

export function useInstancesVolumesIds(): useInstancesVolumesIdsReturn {
  const [ids, setIds] = useState<string[]>([])

  const [state] = useAppState()
  const instances = state.instance.entities

  useMemo(() => {
    if (!instances) return setIds([])

    setIds(
      instances.flatMap((instance) => {
        return instance.volumes
          .filter((vol): vol is ImmutableVolume => 'ref' in vol)
          .map((vol) => vol.ref)
      }),
    )
  }, [instances])

  return ids
}
