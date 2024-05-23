/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from 'react'
import { useNotification } from '@aleph-front/core'
import {
  ConnectionConnectAction,
  ConnectionDisconnectAction,
  ConnectionUpdateAction,
} from '@/store/connection'
import { connectionProviderManager } from '@/domain/connect'
import { useAppState } from '@/contexts/appState'
import { useSessionStorage } from 'usehooks-ts'

export type UseConnectionProps = {
  triggerOnMount?: boolean
}

export type UseConnectionReturn = {
  handleConnect: (payload: ConnectionConnectAction['payload']) => void
  handleDisconnect: () => void
}

export const useConnection = ({
  triggerOnMount,
}: UseConnectionProps): UseConnectionReturn => {
  const [state, dispatch] = useAppState()
  const { blockchain, provider } = state.connection

  const noti = useNotification()
  const addNotification = noti?.add

  const handleConnect = useCallback(
    (payload: ConnectionConnectAction['payload']) =>
      dispatch(new ConnectionConnectAction(payload)),
    [dispatch],
  )

  const handleDisconnect = useCallback(
    () => dispatch(new ConnectionDisconnectAction()),
    [dispatch],
  )

  const [storedConnection, setStoredConnection] = useSessionStorage<
    ConnectionConnectAction['payload'] | undefined
  >('connection', undefined)

  useEffect(() => {
    if (!triggerOnMount) return
    if (!storedConnection) return

    handleConnect(storedConnection)
  }, [triggerOnMount])

  // @note: Switch the wallet provider each time there is a new one selected
  useEffect(() => {
    if (!triggerOnMount) return
    if (!provider) return

    const connectionProvider = connectionProviderManager.of(provider)

    const handleUpdate = (payload: ConnectionUpdateAction['payload']) => {
      dispatch(new ConnectionUpdateAction(payload))
    }

    const handleDisconnect = ({ error }: { error?: Error }) => {
      dispatch(new ConnectionDisconnectAction())

      if (!error) return

      addNotification &&
        addNotification({
          variant: 'error',
          title: 'Error',
          text: error?.message,
        })
    }

    async function exec() {
      if (!blockchain) return

      connectionProvider.events.on('update', handleUpdate)
      connectionProvider.events.on('disconnect', handleDisconnect)

      try {
        await connectionProvider.connect(blockchain)
        setStoredConnection({ provider, blockchain })
      } catch (error) {
        handleDisconnect({ error: error as Error })
      }
    }

    exec()

    return () => {
      connectionProvider.events.off('update', handleUpdate)
      connectionProvider.events.off('disconnect', handleDisconnect)

      connectionProvider.disconnect()
      setStoredConnection(undefined)
    }
  }, [triggerOnMount, provider])

  // @note: Switch the blockchain network without recconecting to the providers
  useEffect(() => {
    if (!triggerOnMount) return

    async function exec() {
      if (!provider) return
      if (!blockchain) return

      const connectionProvider = connectionProviderManager.of(provider)
      const isConnected = await connectionProvider.isConnected()

      if (!isConnected) return

      try {
        await connectionProvider.switchBlockchain(blockchain)
        setStoredConnection({ provider, blockchain })
      } catch (error) {
        addNotification &&
          addNotification({
            variant: 'error',
            title: 'Error',
            text: (error as Error)?.message,
          })
      }
    }

    exec()
  }, [triggerOnMount, provider, blockchain])

  return {
    handleConnect,
    handleDisconnect,
  }
}
