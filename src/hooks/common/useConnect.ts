import { useAppState } from '@/contexts/appState'
import { getAccountBalance, web3Connect } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { useNotification } from '@aleph-front/core'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { useCallback } from 'react'
import { useSessionStorage } from 'usehooks-ts'
import Provider from '@walletconnect/ethereum-provider'
import { Providers } from '../pages/useHeader'

export type UseConnectReturn = {
  connect: (chain?: Chain, provider?: Providers) => Promise<Account | undefined>
  disconnect: (provider: Providers) => Promise<void>
  isConnected: boolean
  account: Account | undefined
  tryReconnect: () => Promise<void>
  switchNetwork: (chain: Chain) => Promise<Account | undefined>
  selectedNetwork: Chain
}
type NotificationCardVariant = 'error' | 'success' | 'warning'

export function useConnect(): UseConnectReturn {
  const [state, dispatch] = useAppState()
  const noti = useNotification()
  const [keepAccountAlive, setKeepAccountAlive] = useSessionStorage(
    'keepAccountAlive',
    false,
  )
  const [selectedNetwork, setSelectedNetwork] = useSessionStorage<Chain>(
    'selectedNetwork',
    Chain.ETH,
  )

  const onNoti = useCallback(
    (error: string, variant: NotificationCardVariant) => {
      noti &&
        noti.add({
          variant,
          title: variant.charAt(0).toUpperCase() + variant.slice(1),
          text: error,
        })
    },
    [noti],
  )

  const getBalance = useCallback(
    async (account: Account) => {
      const balance = await getAccountBalance(account)
      dispatch({ type: ActionTypes.setAccountBalance, payload: { balance } })
    },
    [dispatch],
  )

  const connect = useCallback(
    async (chain?: Chain, provider?: Providers) => {
      if (!chain) return
      let account

      try {
        if (!provider && window.ethereum) {
          provider = window.ethereum
        }
        if (provider && (provider as any).isWalletConnect) {
          await handleWalletConnect(provider as Provider, chain)
        }
        // else if (!provider && window.web3) {
        //   provider = window.web3.currentProvider
        // } else if (!provider && window.solana) {
        //   provider = window.solana
        // }
        account = await web3Connect(chain, provider)
        if (!account) return

        setKeepAccountAlive(true)
        setSelectedNetwork(chain)
        await Promise.all([getBalance(account)])
      } catch (err) {
        console.log(err)
        const e = err as Error
        onNoti(e.message, 'error') // we assume because the user denied the connection
      }

      dispatch({ type: ActionTypes.connect, payload: { account } })

      return account
    },
    [setKeepAccountAlive, getBalance, dispatch, onNoti],
  )

  const handleWalletConnect = async (provider: Provider, chain: Chain) => {
    if (provider.signer.client.session.getAll().length === 0) {
      await provider.connect({
        chains: [chainToId(chain)],
      })
    }
  }

  const disconnect = useCallback(async (provider: Providers) => {
    if (provider && (provider as any).isWalletConnect) {
      await (provider as Provider).disconnect()
    }
    setKeepAccountAlive(false)
    dispatch({ type: ActionTypes.disconnect, payload: null })
  }, [dispatch, setKeepAccountAlive])

  const switchNetwork = useCallback(
    async (chain: Chain) => {
      let account

      try {
        account = await web3Connect(chain, window.ethereum)
        setSelectedNetwork(chain)
        await Promise.all([getBalance(account)])
      } catch (err) {
        const e = err as Error
        onNoti(`Error during network switch: ${e.message}`, 'error')
      }

      return account
    },
    [connect, setSelectedNetwork],
  )

  const { account } = state
  const isConnected = !!account?.address

  const tryReconnect = useCallback(async () => {
    if (isConnected || !keepAccountAlive) return
    await connect()
  }, [isConnected, keepAccountAlive, connect])

  return {
    connect,
    disconnect,
    isConnected,
    account,
    tryReconnect,
    switchNetwork,
    selectedNetwork,
  }
}

// todo: get useHeader helpers and improve this also
export function chainToId(chain: Chain): number {
  switch (chain) {
    case Chain.ETH:
      return 1
    case Chain.AVAX:
      return 43114
    default:
      return 1
  }
}
