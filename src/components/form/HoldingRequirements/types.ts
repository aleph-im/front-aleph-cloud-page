import { PerVolumeCostItem } from '@/domain/volume'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import { DomainField } from '@/hooks/form/useAddDomains'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { StreamDurationField } from '@/hooks/form/useSelectStreamDuration'
import { ReactNode } from 'react'
import { Control } from 'react-hook-form'

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
} & (
  | {
      paymentMethod: PaymentMethod.Stream
      control: Control
      receiverAddress?: string
      streamDuration?: StreamDurationField
    }
  | {
      paymentMethod: PaymentMethod.Hold
      control?: undefined
      receiverAddress?: undefined
      streamDuration?: undefined
    }
)

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
