import { StorageInformationProps } from '../StorageInformation/types'
import { ComputingInformationProps } from '../ComputingInformation/types'

type InformationDataProps = ComputingInformationProps | StorageInformationProps

type InformationProps = {
  title?: string
  type: 'computing' | 'storage'
  data: InformationDataProps
}

type ItemsProps = {
  title?: string
  img?: string
  buttonUrl?: string
  buttonIsExternal?: boolean
  buttonDisabled?: boolean
  buttonTooltip?: string
  information: InformationProps
}

export type EntitySummaryCardProps = {
  items: ItemsProps[]
}
