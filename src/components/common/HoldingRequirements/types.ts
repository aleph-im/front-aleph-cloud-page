import { PerVolumeCostItem } from '@/domain/volume'
import { EntityType } from '@/helpers/constants'
import { DomainProp } from '@/hooks/form/useAddDomains'
import { VolumeProp } from '@/hooks/form/useAddVolume'
import { InstanceSpecsProp } from '@/hooks/form/useSelectInstanceSpecs'

export type HoldingRequirementsProps = {
  address: string
  unlockedAmount: number
  type: EntityType.Program | EntityType.Instance | EntityType.Volume
  isPersistent?: boolean
  specs?: InstanceSpecsProp
  volumes?: VolumeProp[]
  domains?: DomainProp[]
}

export type HoldingRequirementsVolumeLineProps = {
  volume: VolumeProp
  cost?: PerVolumeCostItem
}

export type HoldingRequirementsDomainLineProps = {
  domain: DomainProp
}
