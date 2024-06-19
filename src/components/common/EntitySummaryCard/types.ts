type StorageInformationProps = {
  title?: string
  storage: number
  amount?: number
}

type ComputingInformationProps = {
  running: number
}

type InformationDataProps = ComputingInformationProps | StorageInformationProps

type InformationProps = {
  type: 'computing' | 'storage'
  data: InformationDataProps
}

type ItemsProps = {
  title: string
  img?: string
  buttonUrl?: string
  information: InformationProps
}

export type EntitySummaryCardProps = {
  items: ItemsProps[]
  size?: 'sm' | 'md'
}
