import { PerVolumeCostItem } from '@/domain/volume'
import { EntityType } from '@/helpers/constants'
import { DomainField } from '@/hooks/form/useAddDomains'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { ReactNode } from 'react'

export type HoldingRequirementsProps = {
  address: string
  unlockedAmount: number
  type: EntityType.Program | EntityType.Instance | EntityType.Volume
  isPersistent?: boolean
  specs?: InstanceSpecsField
  volumes?: VolumeField[]
  domains?: DomainField[]
  button?: ReactNode
  description?: ReactNode
}

export type HoldingRequirementsSpecsLineProps = {
  type: EntityType.Program | EntityType.Instance | EntityType.Volume
  specs: InstanceSpecsField
  cost: number
}

export type HoldingRequirementsVolumeLineProps = {
  volume: VolumeField
  specs?: InstanceSpecsField
  cost?: PerVolumeCostItem
}

export type HoldingRequirementsDomainLineProps = {
  domain: DomainField
}
