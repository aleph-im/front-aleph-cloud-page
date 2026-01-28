import { useCallback, useEffect, useRef } from 'react'
import { useNotification } from '@aleph-front/core'
import {
  ConnectionUpdateAction,
  ConnectionDisconnectAction,
} from '@/store/connection'
import { useAppState } from '@/contexts/appState'
import { useReown } from '@/contexts/reownContext'
import { ProviderId, BlockchainId } from '@/domain/connect'
import { getAccountBalance } from '@/helpers/utils'
import { PaymentMethod } from '@/helpers/constants'

/**
 * Hook that integrates Reown connection with App store
 * Syncs Reown state changes with the app's App connection state
 */
export const useReownConnection = () => {
  const [, dispatch] = useAppState()
  const reown = useReown()
  const noti = useNotification()

  const prevIsConnectedRef = useRef(reown.isConnected)
  const prevChainIdRef = useRef(reown.chainId)
  const prevAddressRef = useRef(reown.address)

  // Use ref to prevent infinite re-renders
  const addNotificationRef = useRef(noti?.add)

  useEffect(() => {
    addNotificationRef.current = noti?.add
  }, [noti?.add])

  /**
   * Syncs Reown connection state with App store
   * Triggers when connection status or chain changes
   */
  useEffect(() => {
    const syncConnection = async () => {
      // Handle disconnection
      if (prevIsConnectedRef.current && !reown.isConnected) {
        dispatch(
          new ConnectionDisconnectAction({
            provider: ProviderId.Reown,
          }),
        )
        prevIsConnectedRef.current = false
        prevChainIdRef.current = undefined
        prevAddressRef.current = undefined
        return
      }

      // Handle connection or chain switch
      if (
        reown.isConnected &&
        (prevIsConnectedRef.current !== reown.isConnected ||
          prevChainIdRef.current !== reown.chainId ||
          prevAddressRef.current !== reown.address)
      ) {
        const blockchainId = reown.getBlockchainId()

        // During network switching, chainId might be temporarily undefined
        // Only error if we have a chainId but it's unsupported
        if (!blockchainId) {
          // Update refs to prevent infinite loop
          prevChainIdRef.current = reown.chainId

          // Only show error if chainId is actually set (not undefined during transition)
          if (reown.chainId !== undefined) {
            addNotificationRef.current?.({
              variant: 'error',
              title: 'Error',
              text: 'Unsupported network. Please switch to a supported network.',
            })
          }
          return
        }

        try {
          const account = await reown.getAlephAccount()

          if (!account) {
            addNotificationRef.current?.({
              variant: 'error',
              title: 'Error',
              text: 'Failed to get account from wallet',
            })
            return
          }

          // Fetch balance
          const { balance, creditBalance } = await getAccountBalance(
            account,
            PaymentMethod.Hold,
          )

          // Update Redux store
          dispatch(
            new ConnectionUpdateAction({
              account,
              provider: ProviderId.Reown,
              blockchain: blockchainId,
              balance,
              creditBalance,
            }),
          )

          prevIsConnectedRef.current = reown.isConnected
          prevChainIdRef.current = reown.chainId
          prevAddressRef.current = reown.address
        } catch (error) {
          addNotificationRef.current?.({
            variant: 'error',
            title: 'Connection Error',
            text: (error as Error)?.message || 'Failed to connect wallet',
          })
        }
      }
    }

    syncConnection()
  }, [reown, dispatch])

  /**
   * Opens Reown modal for wallet connection
   */
  const handleConnect = useCallback(
    (blockchain?: BlockchainId) => {
      if (!reown.isConnected) reown.openModal(blockchain)
    },
    [reown],
  )

  /**
   * Disconnects wallet and clears Redux store
   */
  const handleDisconnect = useCallback(async () => {
    try {
      await reown.disconnect()
    } catch (error) {
      addNotificationRef.current?.({
        variant: 'error',
        title: 'Error',
        text: 'Failed to disconnect wallet',
      })
    }
  }, [reown])

  /**
   * Switches to a different blockchain network
   */
  const handleSwitchNetwork = useCallback(
    async (chainId: number) => {
      try {
        await reown.switchNetwork(chainId)
      } catch (error) {
        addNotificationRef.current?.({
          variant: 'error',
          title: 'Network Switch Error',
          text: (error as Error)?.message || 'Failed to switch network',
        })
      }
    },
    [reown],
  )

  return {
    handleConnect,
    handleDisconnect,
    handleSwitchNetwork,
    reown,
  }
}
