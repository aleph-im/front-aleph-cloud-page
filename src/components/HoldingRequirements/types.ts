import { EntityType } from '@/helpers/constants'
import { Volume } from '@/hooks/form/useAddVolume'
import { InstanceSpecs } from '@/hooks/form/useSelectInstanceSpecs'

export type HoldingRequirementsProps = {
  address: string
  unlockedAmount: number
  type: EntityType
  isPersistentVM?: boolean
  specs?: InstanceSpecs
  volumes?: Volume[]
}

export type HoldingRequirementsVolumeLineProps = {
  volume: Volume
  price: number
}
