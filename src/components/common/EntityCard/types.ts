import { ReactNode } from 'react'
import { HTMLAttributeAnchorTarget } from 'react'
import { AmountInformationProps } from '../AmountInformation/types'
import { ComputingInformationProps } from '../ComputingInformation/types'
import { StorageInformationProps } from '../StorageInformation/types'

export type InformationDataProps =
  | ComputingInformationProps
  | StorageInformationProps
  | AmountInformationProps

export type InformationProps = {
  type: 'computing' | 'storage' | 'amount'
  data?: InformationDataProps
}

export type EntityCardItemProps = {
  title: string
  description: string
  information: InformationProps
}

export type EntityCardType = 'introduction' | 'active'

export type EntityCardProps = {
  type?: EntityCardType
  isComingSoon?: boolean
  isBeta?: boolean
  title: string
  img: string
  description?: string
  dashboardPath?: string
  createPath?: string
  createTarget?: HTMLAttributeAnchorTarget
  introductionButtonText?: string
  information: InformationProps
  storage?: number
  amount?: number
  subItems?: EntityCardItemProps[]
  children?: ReactNode
}
