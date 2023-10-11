import { useRouter } from 'next/router'
import { useCallback, useState, useEffect, useRef, RefObject } from 'react'
import { DefaultTheme, useTheme } from 'styled-components'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { useAppState } from '@/contexts/appState'
import { useConnect } from '../common/useConnect'
import { useSessionStorage } from 'usehooks-ts'
import { useClickOutside } from '@aleph-front/aleph-core'

export type UseHeaderReturn = {
  theme: DefaultTheme
  account: Account | undefined
  displayWalletPicker: boolean
  accountBalance?: number
  divRef: RefObject<HTMLDivElement>
  isOpen: boolean
  isOnPath: (path: string) => boolean
  handleToggleOpen: (open: boolean) => void
  handleCloseMenu: () => void
  handleConnect: () => void
  handleDisplayWalletPicker: () => void
  provider: () => void
}

export function useHeader(): UseHeaderReturn {
  const { connect, disconnect, isConnected, account } = useConnect()
  const theme = useTheme()
  const [appState] = useAppState()
  const router = useRouter()

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

  const { accountBalance } = appState

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

  // --------------------

  const divRef = useRef<HTMLDivElement>(null)

  useClickOutside(() => {
    if (displayWalletPicker) setDisplayWalletPicker(false)
  }, [divRef])

  const handleDisplayWalletPicker = () => {
    setDisplayWalletPicker(!displayWalletPicker)
  }

  const provider = () => {
    window.ethereum?.on('accountsChanged', function () {
      connect()
    })

    return window.ethereum
  }

  // @todo: handle this on the provider method of the WalletConnect component
  // the provider function should initialize the provider and return a dispose function
  useEffect(() => {
    provider()
    return () => {
      window.ethereum?.removeListener('accountsChanged', () => {
        connect()
      })
    }
  }, [])

  const [isOpen, setIsOpen] = useState(false)

  const handleToggleOpen = useCallback((open: boolean) => {
    setIsOpen(open)
  }, [])

  const handleCloseMenu = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  return {
    theme,
    account,
    displayWalletPicker,
    accountBalance,
    divRef,
    isOpen,
    isOnPath,
    handleToggleOpen,
    handleConnect,
    handleDisplayWalletPicker,
    handleCloseMenu,
    provider,
  }
}
