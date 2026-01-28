import { EntityType } from '@/helpers/constants'
import { UseEntityCostReturn } from '@/hooks/common/useEntityCost'
import { InsufficientFundsInfo } from '@/hooks/common/useInsufficientFunds'
import { DomainField } from '@/hooks/form/useAddDomains'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { WebsiteFolderField } from '@/hooks/form/useAddWebsiteFolder'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { StreamDurationUnit } from '@/hooks/form/useSelectStreamDuration'
import { ReactNode, RefObject } from 'react'
import { Control } from 'react-hook-form'

export type CheckoutSummaryProps = {
  address: string
  unlockedAmount: number
  cost: UseEntityCostReturn
  // website?: WebsiteFolderField
  // isPersistent?: boolean
  // specs?: InstanceSpecsField
  // volume?: VolumeField
  // volumes?: VolumeField[]
  // domains?: DomainField[]
  button?: ReactNode
  footerButton?: ReactNode
  description?: ReactNode
  mainRef?: RefObject<HTMLElement>
  control?: Control
  minimumBalanceNeeded?: number
  insufficientFunds?: InsufficientFundsInfo
}

export type CheckoutSummarySpecsLineProps = {
  type: EntityType.Program | EntityType.Instance
  specs: InstanceSpecsField
  cost: number
  priceDuration: StreamDurationUnit | undefined
}

export type CheckoutSummaryVolumeLineProps = {
  volume: VolumeField
  specs?: InstanceSpecsField
  cost?: any // PerVolumeCostItem
  priceDuration: StreamDurationUnit | undefined
}

export type CheckoutSummaryWebsiteLineProps = {
  website: WebsiteFolderField
  cost?: number
}

export type CheckoutSummaryDomainLineProps = {
  domain: DomainField
}
