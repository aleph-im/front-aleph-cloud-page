import { PerVolumeCostItem } from '@/domain/volume'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import { DomainField } from '@/hooks/form/useAddDomains'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { WebsiteFolderField } from '@/hooks/form/useAddWebsiteFolder'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import {
  StreamDurationField,
  StreamDurationUnit,
} from '@/hooks/form/useSelectStreamDuration'
import { ReactNode, RefObject } from 'react'
import { Control } from 'react-hook-form'

export type CheckoutSummaryProps = Partial<WebsiteFolderField> & {
  address: string
  unlockedAmount: number
  type:
    | EntityType.Program
    | EntityType.Instance
    | EntityType.Volume
    | EntityType.Website
  isPersistent?: boolean
  specs?: InstanceSpecsField
  volumes?: VolumeField[]
  domains?: DomainField[]
  button?: ReactNode
  description?: ReactNode
  mainRef?: RefObject<HTMLElement>
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

export type CheckoutSummarySpecsLineProps = {
  type: EntityType.Program | EntityType.Instance
  specs: InstanceSpecsField
  cost: number
  priceDuration: StreamDurationUnit | undefined
}

export type CheckoutSummaryVolumeLineProps = {
  volume: VolumeField
  specs?: InstanceSpecsField
  cost?: PerVolumeCostItem
  priceDuration: StreamDurationUnit | undefined
}

export type CheckoutSummaryWebsiteLineProps = WebsiteFolderField & {
  cost?: number
}

export type CheckoutSummaryDomainLineProps = {
  domain: DomainField
}
