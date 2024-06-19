import { ReactNode } from 'react'
import { ComputingInformationProps } from '../ComputingInformation/types'
import { StorageInformationProps } from '../StorageInformation/types'

export type InformationDataProps =
  | ComputingInformationProps
  | StorageInformationProps

export type InformationProps = {
  type: 'computing' | 'storage'
  data?: InformationDataProps
}

export type EntityCardItemProps = {
  title: string
  description: string
  information: InformationProps
}

export type EntityCardProps = {
  type?: 'introduction' | 'active'
  isComingSoon?: boolean
  title: string
  titleTooltip?: ReactNode
  img: string
  description?: string
  link: string
  introductionButtonText?: string
  information: InformationProps
  storage?: number
  amount?: number
  subItems?: EntityCardItemProps[]
}
