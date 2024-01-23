import { useRouter } from 'next/router'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { DefaultTheme, useTheme } from 'styled-components'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { useAppState } from '@/contexts/appState'
import { useConnect } from '../common/useConnect'
import { useSessionStorage } from 'usehooks-ts'
import {
  BreakpointId,
  useClickOutside,
  useFloatPosition,
  useTransitionedEnterExit,
  useWindowScroll,
  useWindowSize,
} from '@aleph-front/aleph-core'
import { useRoutes, UseRoutesReturn } from '../common/useRoutes'
import { useBreadcrumbNames, UseBreadcrumbNamesReturn } from '../common/useBreadcrumbNames'

export type UseAccountButtonProps = {
  handleConnect: (chain?: Chain) => Promise<void>
  provider: () => void
}

export type UseAccountButtonReturn = UseAccountButtonProps & {
  theme: DefaultTheme
  account: Account | undefined
  accountBalance?: number
  displayWalletPicker: boolean
  walletPickerOpen: boolean
  walletPickerRef: RefObject<HTMLDivElement>
  walletPickerTriggerRef: RefObject<HTMLButtonElement>
  walletPosition: { x: number; y: number }
  handleDisplayWalletPicker: () => void
  selectedNetwork: Chain
  handleNetworkSelection: (network: Chain) => void
}

export function useAccountButton({
  handleConnect: handleConnectProp,
  ...rest
}: UseAccountButtonProps): UseAccountButtonReturn {
  const { account } = useConnect()
  const theme = useTheme()
  const [appState] = useAppState()

  // const { balance: accountBalance } = appState.account
  const { accountBalance } = appState

  const [displayWalletPicker, setDisplayWalletPicker] = useState(false)

  const [selectedNetwork, setSelectedNetwork] = useState<Chain>(Chain.ETH);

  const handleNetworkSelection = (network: Chain) => {
    setSelectedNetwork(network);
  };

  // --------------------

  const walletPickerRef = useRef<HTMLDivElement>(null)
  const walletPickerTriggerRef = useRef<HTMLButtonElement>(null)

  useClickOutside(() => {
    if (displayWalletPicker) setDisplayWalletPicker(false)
  }, [walletPickerRef, walletPickerTriggerRef])

  const handleDisplayWalletPicker = () => {
    setDisplayWalletPicker(!displayWalletPicker)
  }

  const windowSize = useWindowSize(0)
  const windowScroll = useWindowScroll(0)

  const { shouldMount, state } = useTransitionedEnterExit({
    onOff: displayWalletPicker,
    ref: walletPickerRef,
  })

  const { myRef, atRef, position } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: walletPickerRef,
    atRef: walletPickerTriggerRef,
    deps: [account, windowSize, windowScroll, shouldMount],
  })

  const walletPickerOpen = state === 'enter'

  const handleConnect = useCallback(async (chain?: Chain) => {
    handleConnectProp(chain)
    setDisplayWalletPicker(false)
  }, [handleConnectProp])

  return {
    theme,
    account,
    accountBalance,
    walletPickerOpen,
    displayWalletPicker: shouldMount,
    walletPickerRef: myRef,
    walletPickerTriggerRef: atRef,
    walletPosition: position,
    handleDisplayWalletPicker,
    handleConnect,
    selectedNetwork,
    handleNetworkSelection,
    ...rest,
  }
}

// -----------------------------

export type UseHeaderReturn = UseRoutesReturn & {
  pathname: string
  breadcrumbNames: UseBreadcrumbNamesReturn['names']
  breakpoint: BreakpointId
  isOpen: boolean
  hasBreadcrumb: boolean
  handleToggle: (isOpen: boolean) => void
  handleConnect: () => Promise<void>
  provider: () => void
}

export function useHeader(): UseHeaderReturn {
  const { connect, disconnect, isConnected, account } = useConnect()
  const { routes } = useRoutes()
  const router = useRouter()

  const { pathname } = router

  const [keepAccountAlive, setkeepAccountAlive] = useSessionStorage(
    'keepAccountAlive',
    false,
  )

  const enableConnection = useCallback(async () => {
    if (!isConnected) {
      const acc = await connect()
      if (!acc) return
    } else {
      await disconnect()
    }
  }, [connect, disconnect, isConnected])

  // @note: wait till account is connected and redirect
  const handleConnect = useCallback(async () => {
    if (!isConnected) {
      setkeepAccountAlive(true)
      const acc = await connect()
      if (!acc) return
      // router.push('/dashboard')
    } else {
      setkeepAccountAlive(false)
      await disconnect()
      router.push('/')
    }
  }, [connect, disconnect, isConnected, router, setkeepAccountAlive])

  useEffect(() => {
    ;(async () => {
      if (!account && keepAccountAlive) {
        enableConnection()
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, keepAccountAlive])

  // --------------------

  const provider = () => {
    ;(window.ethereum as any)?.on('accountsChanged', function () {
      connect()
    })

    return window.ethereum
  }

  // @todo: handle this on the provider method of the WalletConnect component
  // the provider function should initialize the provider and return a dispose function
  useEffect(() => {
    provider()
    return () => {
      ;(window.ethereum as any)?.removeListener('accountsChanged', () => {
        connect()
      })
    }
  }, [])

  // --------------------

  const { names: breadcrumbNames } = useBreadcrumbNames()
  const hasBreadcrumb = router.pathname !== '/'

  // --------------------

  const breakpoint = 'lg'

  // --------------------

  const [isOpen, setIsOpen] = useState(false)
  const handleToggle = useCallback((open: boolean) => setIsOpen(open), [])

  return {
    pathname,
    routes,
    breadcrumbNames,
    breakpoint,
    isOpen,
    hasBreadcrumb,
    handleToggle,
    handleConnect,
    provider,
  }
}
