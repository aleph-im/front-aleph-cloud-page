import { useCallback, useEffect, useRef } from 'react'
import { useNotification } from '@aleph-front/core'
import {
  ConnectionConnectAction,
  ConnectionDisconnectAction,
  ConnectionState,
  ConnectionUpdateAction,
} from '@/store/connection'
import { connectionProviderManager } from '@/domain/connect'
import { useAppState } from '@/contexts/appState'
import { useSessionStorage } from 'usehooks-ts'
import { BaseConnectionProviderManager } from '@/domain/connect/base'

export type UseConnectionProps = {
  triggerOnMount?: boolean
}

export type UseConnectionReturn = ConnectionState & {
  handleConnect: (payload: ConnectionConnectAction['payload']) => void
  handleDisconnect: () => void
}

export const useConnection = ({
  triggerOnMount,
}: UseConnectionProps): UseConnectionReturn => {
  const [state, dispatch] = useAppState()
  const { blockchain, provider } = state.connection

  const prevConnectionProviderRef = useRef<
    BaseConnectionProviderManager | undefined
  >()

  const noti = useNotification()
  const addNotification = noti?.add

  const handleConnect = useCallback(
    (payload: ConnectionConnectAction['payload']) =>
      dispatch(new ConnectionConnectAction(payload)),
    [dispatch],
  )

  const handleDisconnect = useCallback(
    () => dispatch(new ConnectionDisconnectAction({ provider })),
    [dispatch, provider],
  )

  const [storedConnection, setStoredConnection] = useSessionStorage<
    ConnectionConnectAction['payload'] | undefined
  >('connection', undefined)

  useEffect(() => {
    if (!triggerOnMount) return
    if (!storedConnection) return

    handleConnect(storedConnection)
  }, [handleConnect, storedConnection, triggerOnMount])

  useEffect(() => {
    const handleUpdate = (payload: ConnectionUpdateAction['payload']) => {
      dispatch(new ConnectionUpdateAction(payload))
    }

    const handleDisconnect = ({
      provider,
      error,
    }: ConnectionDisconnectAction['payload']) => {
      dispatch(new ConnectionDisconnectAction({ provider, error }))
      if (!error) return
      addNotification &&
        addNotification({
          variant: 'error',
          title: 'Error',
          text: error?.message,
        })
    }

    async function exec() {
      if (!triggerOnMount) return

      // Load connection providers
      const prevConnectionProvider = prevConnectionProviderRef.current
      const connectionProvider = provider
        ? connectionProviderManager.of(provider)
        : undefined

      // If there's a previous connection provider and it's different from the current one
      // then disconnect from the previous provider
      if (
        prevConnectionProvider &&
        connectionProvider !== prevConnectionProvider
      ) {
        prevConnectionProvider.events.off('update', handleUpdate)
        prevConnectionProvider.events.off('disconnect', handleDisconnect)

        await prevConnectionProvider.disconnect()
      }

      // Update refs
      prevConnectionProviderRef.current = connectionProvider

      // If no blockchain or provider => Do not connect or switch
      if (!connectionProvider) return
      if (!blockchain) return

      if (connectionProvider !== prevConnectionProvider) {
        connectionProvider.events.on('update', handleUpdate)
        connectionProvider.events.on('disconnect', handleDisconnect)

        try {
          await connectionProvider.connect(blockchain)

          setStoredConnection({ provider, blockchain })
        } catch (error) {
          handleDisconnect({ error: error as Error })
        }
      } else {
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
    }

    exec()
  }, [
    triggerOnMount,
    provider,
    blockchain,
    dispatch,
    addNotification,
    setStoredConnection,
  ])

  return {
    ...state.connection,
    handleConnect,
    handleDisconnect,
  }
}
