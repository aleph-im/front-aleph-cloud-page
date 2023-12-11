import { Control } from 'react-hook-form'

export type IndexerBlockchainNetworkItemProps = {
  name?: string
  index: number
  control: Control
  onRemove: (index?: number) => void
}

export type AddIndexerBlockchainNetworksProps = {
  name: string
  control: Control
}
