import { useCallback, useEffect } from 'react'
import {
  ConnectionConnectAction,
  ConnectionDisconnectAction,
  ConnectionState,
} from '@/store/connection'
import { useAppState } from '@/contexts/appState'
import { useReownConnection } from './useReownConnection'
import { BlockchainId, ProviderId } from '@/domain/connect'

export type UseConnectionProps = {
  triggerOnMount?: boolean
}

export type UseConnectionReturn = ConnectionState & {
  handleConnect: (payload?: ConnectionConnectAction['payload']) => void
  handleDisconnect: () => void
}

/**
 * Main connection hook for the app
 * Provides wallet connection state and actions
 * Now powered by Reown hooks instead of custom provider manager
 */
export const useConnection = ({
  triggerOnMount,
}: UseConnectionProps = {}): UseConnectionReturn => {
  const [state, dispatch] = useAppState()
  const { blockchain } = state.connection

  const {
    handleConnect: openReownModal,
    handleDisconnect: disconnectReown,
    handleSwitchNetwork,
    reown,
  } = useReownConnection()

  /**
   * Opens Reown modal for wallet connection
   * Optionally accepts a blockchain to switch to after connection
   */
  const handleConnect = useCallback(
    (payload?: ConnectionConnectAction['payload']) => {
      if (payload?.blockchain) {
        // Store desired blockchain for after connection
        dispatch(new ConnectionConnectAction(payload))
      }

      openReownModal()
    },
    [openReownModal, dispatch],
  )

  /**
   * Disconnects wallet
   */
  const handleDisconnect = useCallback(async () => {
    await disconnectReown()

    dispatch(new ConnectionDisconnectAction({ provider: ProviderId.Reown }))
  }, [disconnectReown, dispatch])

  /**
   * Auto-connect on mount if wallet was previously connected
   * Reown handles session persistence automatically
   */
  useEffect(() => {
    if (!triggerOnMount) return

    // Reown automatically restores previous session
    // No need to manage session storage manually
  }, [triggerOnMount])

  /**
   * Sync blockchain switching with Reown
   * When Redux store blockchain changes, switch network in Reown
   */
  useEffect(() => {
    if (!reown.isConnected) return
    if (!blockchain) return

    // Check if current Reown blockchain matches desired blockchain
    const currentBlockchain = reown.getBlockchainId()

    // Only switch if different from current
    if (currentBlockchain !== blockchain) {
      // Map blockchain ID to chain ID for switching
      let targetChainId: number

      switch (blockchain) {
        case BlockchainId.ETH:
          targetChainId = 1
          break
        case BlockchainId.AVAX:
          targetChainId = 43114
          break
        case BlockchainId.BASE:
          targetChainId = 8453
          break
        case BlockchainId.SOL:
          targetChainId = 900
          break
        default:
          return
      }

      console.log(
        'useConnection - useEffect - currentBlockchain',
        currentBlockchain,
      )
      console.log('useConnection - useEffect - desired blockchain', blockchain)
      console.log('useConnection - useEffect - targetChainId', targetChainId)
      handleSwitchNetwork(targetChainId)
    }
  }, [blockchain, reown, handleSwitchNetwork])

  return {
    ...state.connection,
    handleConnect,
    handleDisconnect,
  }
}
