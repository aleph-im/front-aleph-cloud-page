import { useMemo } from 'react'
import { Volume } from '@/domain/volume'
import { useAppState } from '@/contexts/appState'
import { useVolumeManager } from '../useManager/useVolumeManager'
import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'
import { ImmutableVolume } from '@aleph-sdk/message'

export type UseRequestConfidentialVolumesProps = Omit<
  UseRequestEntitiesProps<Volume>,
  'name'
>

export type UseRequestConfidentialVolumesReturn =
  UseRequestEntitiesReturn<Volume>

export function useRequestConfidentialVolumes(
  props: UseRequestConfidentialVolumesProps = {},
): UseRequestConfidentialVolumesReturn {
  const [state] = useAppState()
  const confidentials = state.confidential.entities

  const ids = useMemo(() => {
    if (!confidentials) return []

    return confidentials.flatMap((conf) => {
      return conf.volumes
        .filter((vol): vol is ImmutableVolume => 'ref' in vol)
        .map((vol) => vol.ref)
    })
  }, [confidentials])

  const manager = useVolumeManager()
  return useRequestEntities({
    ...props,
    manager,
    name: 'confidentialVolume',
    ids,
  })
}
