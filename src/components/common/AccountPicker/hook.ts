import { useCallback, useMemo, useRef, useState } from 'react'
import {
  useClickOutside,
  useFloatPosition,
  useTransition,
  useWindowScroll,
  useWindowSize,
} from '@aleph-front/core'
import { Network } from './NetworkSelector'
import { UseAccountPickerProps, UseAccountPickerReturn } from './types'
import { Wallet } from './WalletSelector'

export function useAccountPicker({
  handleConnect: handleConnectProp,
  handleDisconnect: handleDisconnectProp,
  accountAddress,
  accountEoaAddress,
  blockchains,
  networks,
  selectedNetwork,
  ...rest
}: UseAccountPickerProps): UseAccountPickerReturn {
  const windowSize = useWindowSize(0)
  const windowScroll = useWindowScroll(0)

  // Helper to get unique wallet across all networks
  const getUniqueWallet = useCallback(() => {
    const allWallets = networks.flatMap((network) => network.wallets || [])
    const uniqueWalletIds = new Set(allWallets.map((w) => w.id))
    return uniqueWalletIds.size === 1 ? allWallets[0] : null
  }, [networks])

  // ----- Wallet picker -----
  const [displayWalletPicker, setDisplayWalletPicker] = useState(false)

  const walletPickerElementRef = useRef<HTMLDivElement>(null)
  const walletPickerButtonRef = useRef<HTMLButtonElement>(null)

  const handleDisplayWalletPicker = useCallback(() => {
    const isUserConnected = !!accountAddress
    const uniqueWallet = getUniqueWallet()

    // If not connected and there's only one unique wallet across all networks, connect directly
    if (!isUserConnected && uniqueWallet && selectedNetwork) {
      handleConnectProp(uniqueWallet, selectedNetwork)
      return
    }

    setDisplayWalletPicker(!displayWalletPicker)
  }, [
    displayWalletPicker,
    selectedNetwork,
    accountAddress,
    handleConnectProp,
    getUniqueWallet,
  ])

  const { shouldMount: shouldMountWalletPicker, stage: stageWalletPicker } =
    useTransition(displayWalletPicker, 250)

  const {
    myRef: walletPickerRef,
    atRef: walletPickerTriggerRef,
    position: walletPosition,
  } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: walletPickerElementRef,
    atRef: walletPickerButtonRef,
    deps: [accountAddress, windowSize, windowScroll, shouldMountWalletPicker],
  })

  const walletPickerOpen = stageWalletPicker === 'enter'

  useClickOutside(() => {
    if (displayWalletPicker) setDisplayWalletPicker(false)
  }, [walletPickerRef, walletPickerButtonRef])

  // ----- Networks picker -----
  const [displayNetworksPicker, setDisplayNetworksPicker] = useState(false)

  const networksPickerElementRef = useRef<HTMLDivElement>(null)
  const networksPickerButtonRef = useRef<HTMLButtonElement>(null)

  const handleDisplayNetworksPicker = () => {
    setDisplayNetworksPicker(!displayNetworksPicker)
  }

  const { shouldMount: shouldMountNetworksPicker, stage: stageNetworksPicker } =
    useTransition(displayNetworksPicker, 250)

  const {
    myRef: networksPickerRef,
    atRef: networksPickerTriggerRef,
    position: networksPosition,
  } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: networksPickerElementRef,
    atRef: networksPickerButtonRef,
    deps: [accountAddress, windowSize, windowScroll, shouldMountNetworksPicker],
  })

  const networksPickerOpen = stageNetworksPicker === 'enter'

  useClickOutside(() => {
    if (displayNetworksPicker) setDisplayNetworksPicker(false)
  }, [networksPickerRef, networksPickerTriggerRef])

  // ----- Condensed picker -----
  const [displayCondensedPicker, setDisplayCondensedPicker] = useState(false)

  const condensedPickerElementRef = useRef<HTMLDivElement>(null)
  const condensedPickerButtonRef = useRef<HTMLButtonElement>(null)

  const handleDisplayCondensedPicker = useCallback(() => {
    const isUserConnected = !!accountAddress
    const uniqueWallet = getUniqueWallet()

    // If not connected and there's only one unique wallet across all networks, connect directly
    if (!isUserConnected && uniqueWallet && selectedNetwork) {
      handleConnectProp(uniqueWallet, selectedNetwork)
      return
    }

    setDisplayCondensedPicker(!displayCondensedPicker)
  }, [
    displayCondensedPicker,
    selectedNetwork,
    accountAddress,
    handleConnectProp,
    getUniqueWallet,
  ])

  const {
    shouldMount: shouldMountCondensedPicker,
    stage: stageCondensedPicker,
  } = useTransition(displayCondensedPicker, 250)

  const {
    myRef: condensedPickerRef,
    atRef: condensedPickerTriggerRef,
    position: condensedPosition,
  } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: condensedPickerElementRef,
    atRef: condensedPickerButtonRef,
    deps: [
      accountAddress,
      windowSize,
      windowScroll,
      shouldMountCondensedPicker,
    ],
  })

  const condensedPickerOpen = stageCondensedPicker === 'enter'

  useClickOutside(() => {
    if (displayCondensedPicker) setDisplayCondensedPicker(false)
  }, [condensedPickerRef, condensedPickerTriggerRef])

  // ----- Settings picker -----
  const [displaySettingsPicker, setDisplaySettingsPicker] = useState(false)

  const settingsPickerElementRef = useRef<HTMLDivElement>(null)
  const settingsPickerButtonRef = useRef<HTMLButtonElement>(null)

  const handleDisplaySettingsPicker = () => {
    setDisplaySettingsPicker(!displaySettingsPicker)
  }

  const { shouldMount: shouldMountSettingsPicker, stage: stageSettingsPicker } =
    useTransition(displaySettingsPicker, 250)

  const {
    myRef: settingsPickerRef,
    atRef: settingsPickerTriggerRef,
    position: settingsPosition,
  } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: settingsPickerElementRef,
    atRef: settingsPickerButtonRef,
    deps: [accountAddress, windowSize, windowScroll, shouldMountSettingsPicker],
  })

  const settingsPickerOpen = stageSettingsPicker === 'enter'

  useClickOutside(() => {
    if (displaySettingsPicker) setDisplaySettingsPicker(false)
  }, [settingsPickerRef, settingsPickerButtonRef])

  // ------------------------------

  const accountAddressHref = useMemo(
    () =>
      `${
        blockchains[selectedNetwork?.id || 'ETH'].explorerUrl
      }address/${accountAddress}`,
    [accountAddress, blockchains, selectedNetwork?.id],
  )

  const accountEoaAddressHref = useMemo(
    () =>
      accountEoaAddress
        ? `${blockchains[selectedNetwork?.id || 'ETH'].explorerUrl}address/${accountEoaAddress}`
        : undefined,
    [accountEoaAddress, blockchains, selectedNetwork?.id],
  )

  const oneNetwork = useMemo(
    () =>
      networks.length < 2 && networks.some((n) => n.id === selectedNetwork?.id),
    [networks, selectedNetwork],
  )

  const uniqueWallet = useMemo(() => getUniqueWallet(), [getUniqueWallet])

  const isConnected = useMemo(() => !!accountAddress, [accountAddress])

  const handleConnect = useCallback(
    (wallet: Wallet, network: Network) => {
      handleConnectProp(wallet, network)
      setDisplayWalletPicker(false)
    },
    [handleConnectProp],
  )

  const handleDisconnect = useCallback(() => {
    handleDisconnectProp()
    setDisplayWalletPicker(false)
  }, [handleDisconnectProp])

  return {
    accountAddress,
    accountEoaAddress,
    accountAddressHref,
    accountEoaAddressHref,
    networks,
    selectedNetwork,
    oneNetwork,
    uniqueWallet,
    isConnected,
    walletPickerOpen,
    displayWalletPicker: shouldMountWalletPicker,
    walletPickerRef,
    walletPickerTriggerRef,
    walletPosition,
    handleDisplayWalletPicker,
    networksPickerOpen,
    displayNetworksPicker: shouldMountNetworksPicker,
    networksPickerRef,
    networksPickerTriggerRef,
    networksPosition,
    handleDisplayNetworksPicker,
    condensedPickerOpen,
    displayCondensedPicker: shouldMountCondensedPicker,
    condensedPickerRef,
    condensedPickerTriggerRef,
    condensedPosition,
    handleDisplayCondensedPicker,
    displaySettingsPicker,
    settingsPickerOpen,
    settingsPickerRef,
    settingsPickerTriggerRef,
    settingsPosition,
    handleDisplaySettingsPicker,
    handleConnect,
    handleDisconnect,
    ...rest,
  }
}
