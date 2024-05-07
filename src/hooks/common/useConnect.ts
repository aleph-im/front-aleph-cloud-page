import { useAppState } from '@/contexts/appState'
import { getAccountBalance, web3Connect } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { useNotification } from '@aleph-front/core'
import { Blockchain } from '@aleph-sdk/core'
import { Account } from '@aleph-sdk/account'
import { useCallback } from 'react'
import { useSessionStorage } from 'usehooks-ts'
import { ExternalProvider } from '@ethersproject/providers'

export type UseConnectReturn = {
  connect: (
    chain?: Blockchain,
    provider?: ExternalProvider,
  ) => Promise<Account | undefined>
  disconnect: () => Promise<void>
  switchNetwork: (chain: Blockchain) => Promise<Account | undefined>
  isConnected: boolean
  account: Account | undefined
  selectedNetwork: Blockchain
}

export function useConnect(): UseConnectReturn {
  const [state, dispatch] = useAppState()
  const noti = useNotification()
  const [selectedNetwork, setSelectedNetwork] = useSessionStorage<Blockchain>(
    'selectedNetwork',
    Blockchain.ETH,
  )

  const onError = useCallback(
    (error: string) => {
      noti &&
        noti.add({
          variant: 'error',
          title: 'Error',
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
    async (chain?: Blockchain, provider?: ExternalProvider) => {
      if (!chain) return

      let account
      try {
        if (!provider && window.ethereum) {
          provider = window.ethereum
        }
        // else if (!provider && window.web3) {
        //   provider = window.web3.currentProvider
        // } else if (!provider && window.solana) {
        //   provider = window.solana
        // }
        account = await web3Connect(chain, provider)
        setSelectedNetwork(chain)
      } catch (err) {
        const e = err as Error
        onError(e.message) // we assume because the user denied the connection
      }
      if (!account) return

      await Promise.all([getBalance(account)]).catch((err) => {
        onError(err.message)
      })

      dispatch({ type: ActionTypes.connect, payload: { account } })

      return account
    },
    [getBalance, dispatch, setSelectedNetwork, onError],
  )

  const disconnect = useCallback(async () => {
    dispatch({ type: ActionTypes.disconnect, payload: null })
  }, [dispatch])

  const switchNetwork = useCallback(
    async (chain: Blockchain) => {
      let account

      try {
        account = await web3Connect(chain, window.ethereum)
        setSelectedNetwork(chain)
        await Promise.all([getBalance(account)]).catch((err) => {
          onError(err.message)
        })

        console.log('Account connected after switching network: ', account)
      } catch (err) {
        const e = err as Error
        console.error('Error during network switch: ', e.message)
      }

      dispatch({ type: ActionTypes.connect, payload: { account } })

      return account
    },
    [dispatch, getBalance, onError, setSelectedNetwork],
  )

  const { account } = state
  const isConnected = !!account?.address

  return {
    connect,
    disconnect,
    switchNetwork,
    isConnected,
    account,
    selectedNetwork,
  }
}
