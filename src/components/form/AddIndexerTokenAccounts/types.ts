import { IndexerBlockchainNetworkField } from '@/hooks/form/useAddIndexerBlockchainNetworks'
import { Control } from 'react-hook-form'

export type IndexerTokenAccountItemProps = {
  name?: string
  index: number
  control: Control
  networks?: IndexerBlockchainNetworkField[]
  onRemove: (index?: number) => void
}

export type AddIndexerTokenAccountsProps = {
  name: string
  control: Control
  networks: IndexerBlockchainNetworkField[]
}
