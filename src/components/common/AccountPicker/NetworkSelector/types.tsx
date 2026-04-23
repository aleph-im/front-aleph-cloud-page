import { IconName } from '@aleph-front/core'
import { Wallet } from '../WalletSelector'

export type Network = {
  id: string
  name: string
  icon: IconName
  wallets: Wallet[]
  disabled?: boolean
  disabledTooltip?: string
}

export type NetworkPickerProps = {
  network: Network
  isSelected: boolean
  onClick: (network: Network) => void
}

export type NetworkSelectorProps = {
  networks: Network[]
  selectedNetwork?: Network
  onSelectNetwork: (network: Network) => void
}
