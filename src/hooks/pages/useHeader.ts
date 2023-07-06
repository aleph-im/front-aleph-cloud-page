import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useConnect } from '../useConnect'
import { DefaultTheme, useTheme } from 'styled-components'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { useAppState } from '@/contexts/appState'
import { useSessionStorage } from 'usehooks-ts'

export type Header = {
  theme: DefaultTheme
  handleConnect: () => void
  enableConnection: () => void
  account: Account | undefined
  isOnPath: (path: string) => boolean
  displayWalletPicker: boolean
  setDisplayWalletPicker: (value: boolean) => void
  accountBalance?: number
}

export function useHeader(): Header {
  const { connect, disconnect, isConnected, account } = useConnect()
  const [appState] = useAppState()
  const theme = useTheme()
  const router = useRouter()

  const { accountBalance } = appState

  const [keepAccountAlive, setkeepAccountAlive] = useSessionStorage(
    'keepAccountAlive',
    false,
  )

  useEffect(() => {
    ;(async () => {
      if (!account && keepAccountAlive) {
        enableConnection()
      }
    })()
  }, [account, keepAccountAlive])

  const isOnPath = (path: string) => router.pathname === path

  // @note: wait till account is connected and redirect
  const handleConnect = useCallback(async () => {
    if (!isConnected) {
      setkeepAccountAlive(true)
      const acc = await connect()
      if (!acc) return
      router.push('/dashboard')
    } else {
      setkeepAccountAlive(false)
      await disconnect()
      router.push('/')
    }

    setDisplayWalletPicker(false)
  }, [connect, disconnect, isConnected, router])

  const enableConnection = useCallback(async () => {
    if (!isConnected) {
      const acc = await connect()
      if (!acc) return
    } else {
      await disconnect()
    }
  }, [connect, disconnect, isConnected, account])

  const [displayWalletPicker, setDisplayWalletPicker] = useState(false)

  return {
    theme,
    handleConnect,
    enableConnection,
    account,
    isOnPath,
    displayWalletPicker,
    setDisplayWalletPicker,
    accountBalance,
  }
}
