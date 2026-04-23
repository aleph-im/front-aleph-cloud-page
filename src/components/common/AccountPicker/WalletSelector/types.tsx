import { Network } from '../NetworkSelector'
import { WalletIconName } from './icons'
import { HTMLAttributes } from 'react'

export type Wallet = {
  id: string
  name: string
  icon: WalletIconName
  color?: string
}

export type WalletSelectorProps = HTMLAttributes<HTMLDivElement> & {
  backgroundColor?: string
  isConnected?: boolean
  selectedNetwork?: Network
  onConnect: (wallet: Wallet, network: Network) => void
  onDisconnect: () => void
}

export type WalletSelectorDisconnectedProps = {
  selectedNetwork?: Network
  onConnect: (wallet: Wallet, network: Network) => void
}

export type WalletSelectorConnectedProps = {
  onDisconnect: () => void
}
