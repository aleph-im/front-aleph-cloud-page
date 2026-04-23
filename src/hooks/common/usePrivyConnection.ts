import { useCallback, useEffect, useRef } from 'react'
import { useNotification } from '@aleph-front/core'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'
import { getAccountFromExternalSigner } from '@aleph-sdk/ethereum'
import { providers } from 'ethers'
import {
  ConnectionUpdateAction,
  ConnectionDisconnectAction,
} from '@/store/connection'
import { useAppState } from '@/contexts/appState'
import { BlockchainId, ProviderId, blockchains } from '@/domain/connect'
import { getAccountBalance } from '@/helpers/utils'
import { PaymentMethod } from '@/helpers/constants'
import { PRIVY_APP_ID } from '@/config/privy'

/**
 * Maps a Privy EVM chain id to our Aleph BlockchainId.
 * Returns undefined for non-EVM or unsupported chains; Solana is intentionally
 * unsupported on the Privy path (Solana stays on Reown).
 */
function privyChainIdToBlockchainId(
  chainId: number | undefined,
): BlockchainId | undefined {
  switch (chainId) {
    case 1:
      return BlockchainId.ETH
    case 43114:
      return BlockchainId.AVAX
    case 8453:
      return BlockchainId.BASE
    default:
      return undefined
  }
}

/**
 * Bridges Privy's auth + embedded wallet + smart wallet into ConnectionState.
 *
 * No-ops when Privy is not configured (NEXT_PUBLIC_PRIVY_APP_ID missing) —
 * this hook can be mounted unconditionally; Reown remains the only active
 * provider in that case.
 *
 * Key design choices:
 * - Aleph identity = embedded EOA (not the smart wallet). The smart wallet
 *   address is surfaced separately via `connection.smartWalletAddress` and is
 *   only used by CreditManager for sponsored top-ups.
 * - This hook only drives dispatch when Privy is the *active* provider. The
 *   coexisting useReownConnection handles the Reown path. If both providers
 *   are connected simultaneously (edge case during transitions), the most
 *   recent successful connect wins — the store holds a single account.
 */
export const usePrivyConnection = () => {
  const [state, dispatch] = useAppState()
  const { ready, authenticated, login, logout } = usePrivy()
  const { wallets, ready: walletsReady } = useWallets()
  const { client: smartWalletClient } = useSmartWallets()
  const noti = useNotification()

  const addNotificationRef = useRef(noti?.add)

  useEffect(() => {
    addNotificationRef.current = noti?.add
  }, [noti?.add])

  const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy')

  // Stable keys for the sync effect
  const embeddedAddress = embeddedWallet?.address
  const embeddedChainId = embeddedWallet?.chainId
    ? // chainId is 'eip155:1' format; strip the namespace
      Number(String(embeddedWallet.chainId).split(':').pop())
    : undefined
  const smartWalletAddress = smartWalletClient?.account?.address

  const prevAuthenticatedRef = useRef(authenticated)
  const prevAddressRef = useRef<string | undefined>(undefined)
  const prevChainIdRef = useRef<number | undefined>(undefined)
  const prevSmartWalletAddressRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!PRIVY_APP_ID) return
    if (!ready || !walletsReady) return

    const run = async () => {
      // Disconnect path
      if (prevAuthenticatedRef.current && !authenticated) {
        dispatch(new ConnectionDisconnectAction({ provider: ProviderId.Privy }))
        prevAuthenticatedRef.current = false
        prevAddressRef.current = undefined
        prevChainIdRef.current = undefined
        prevSmartWalletAddressRef.current = undefined
        return
      }

      // Connect / refresh path
      if (!authenticated || !embeddedWallet || !embeddedAddress) return

      const addressChanged = prevAddressRef.current !== embeddedAddress
      const chainChanged = prevChainIdRef.current !== embeddedChainId
      const justAuthenticated = !prevAuthenticatedRef.current && authenticated
      const smartWalletChanged =
        prevSmartWalletAddressRef.current !== smartWalletAddress

      if (
        !justAuthenticated &&
        !addressChanged &&
        !chainChanged &&
        !smartWalletChanged
      )
        return

      const blockchainId = privyChainIdToBlockchainId(embeddedChainId)
      if (!blockchainId) {
        prevChainIdRef.current = embeddedChainId
        if (embeddedChainId !== undefined) {
          addNotificationRef.current?.({
            variant: 'error',
            title: 'Error',
            text: 'Unsupported network. Privy supports Ethereum, Avalanche, and Base.',
          })
        }
        return
      }

      try {
        if (!smartWalletAddress || !smartWalletClient) return

        const rpcUrl = blockchains[blockchainId].rpcUrl
        const jsonRpcProvider = new providers.JsonRpcProvider(rpcUrl)

        const signFn = (msg: Buffer | string) =>
          smartWalletClient.signMessage({
            message: typeof msg === 'string' ? msg : msg.toString(),
          })
        const account = getAccountFromExternalSigner(
          smartWalletAddress,
          jsonRpcProvider,
          signFn,
        )

        const { balance, creditBalance } = await getAccountBalance(
          account,
          PaymentMethod.Hold,
        )

        dispatch(
          new ConnectionUpdateAction({
            account,
            provider: ProviderId.Privy,
            blockchain: blockchainId,
            balance,
            creditBalance,
            smartWalletAddress,
            eoaAddress: embeddedAddress,
          }),
        )

        prevAuthenticatedRef.current = authenticated
        prevAddressRef.current = embeddedAddress
        prevChainIdRef.current = embeddedChainId
        prevSmartWalletAddressRef.current = smartWalletAddress
      } catch (error) {
        addNotificationRef.current?.({
          variant: 'error',
          title: 'Connection Error',
          text: (error as Error)?.message || 'Failed to connect Privy account',
        })
      }
    }

    run()
  }, [
    ready,
    walletsReady,
    authenticated,
    embeddedWallet,
    embeddedAddress,
    embeddedChainId,
    smartWalletAddress,
    smartWalletClient,
    dispatch,
  ])

  const handleConnect = useCallback(async () => {
    if (!PRIVY_APP_ID) {
      addNotificationRef.current?.({
        variant: 'error',
        title: 'Privy not configured',
        text: 'NEXT_PUBLIC_PRIVY_APP_ID is missing.',
      })
      return
    }
    if (!ready) return
    if (authenticated) return
    try {
      login()
    } catch (error) {
      addNotificationRef.current?.({
        variant: 'error',
        title: 'Sign-in failed',
        text: (error as Error)?.message || 'Privy login did not complete',
      })
    }
  }, [ready, authenticated, login])

  const handleDisconnect = useCallback(async () => {
    if (!PRIVY_APP_ID) return
    try {
      await logout()
    } catch (error) {
      addNotificationRef.current?.({
        variant: 'error',
        title: 'Error',
        text: 'Failed to sign out of Privy',
      })
    }
  }, [logout])

  // Privy's chain switch goes through the embedded wallet. No-op if the
  // requested chain is outside Privy's supported EVM set; caller should fall
  // back to Reown for Solana.
  const handleSwitchNetwork = useCallback(
    async (chainId: number) => {
      if (!embeddedWallet) return
      if (privyChainIdToBlockchainId(chainId) === undefined) {
        addNotificationRef.current?.({
          variant: 'error',
          title: 'Network Switch Error',
          text: 'Privy only supports Ethereum, Avalanche, and Base.',
        })
        return
      }
      try {
        await embeddedWallet.switchChain(chainId)
      } catch (error) {
        addNotificationRef.current?.({
          variant: 'error',
          title: 'Network Switch Error',
          text: (error as Error)?.message || 'Failed to switch network',
        })
      }
    },
    [embeddedWallet],
  )

  return {
    handleConnect,
    handleDisconnect,
    handleSwitchNetwork,
    ready,
    authenticated,
    embeddedWallet,
    smartWalletClient,
    smartWalletAddress,
    isActive:
      state.connection.provider === ProviderId.Privy &&
      !!state.connection.account,
  }
}
