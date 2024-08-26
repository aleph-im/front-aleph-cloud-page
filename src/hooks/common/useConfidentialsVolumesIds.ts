import { useMemo, useState } from 'react'
import { useAppState } from '@/contexts/appState'
import { ImmutableVolume } from '@aleph-sdk/message'

export type useConfidentialsVolumesIdsReturn = string[]

export function useConfidentialsVolumesIds(): useConfidentialsVolumesIdsReturn {
  const [ids, setIds] = useState<string[]>([])

  const [state] = useAppState()
  const confidentials = state.confidential.entities

  useMemo(() => {
    if (!confidentials) return setIds([])

    setIds(
      confidentials.flatMap((confidential) => {
        return confidential.volumes
          .filter((vol): vol is ImmutableVolume => 'ref' in vol)
          .map((vol) => vol.ref)
      }),
    )
  }, [confidentials])

  return ids
}
