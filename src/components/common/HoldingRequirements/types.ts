import { EntityType } from '@/helpers/constants'
import { VolumeProp } from '@/hooks/form/useAddVolume'
import { InstanceSpecsProp } from '@/hooks/form/useSelectInstanceSpecs'

export type HoldingRequirementsProps = {
  address: string
  unlockedAmount: number
  type: EntityType
  isPersistentVM?: boolean
  specs?: InstanceSpecsProp
  volumes?: VolumeProp[]
}

export type HoldingRequirementsVolumeLineProps = {
  volume: VolumeProp
  price: number
}
