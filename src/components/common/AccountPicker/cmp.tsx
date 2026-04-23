import React, { memo } from 'react'
import { Button } from '@aleph-front/core'
import { StyledIcon, StyledLine, StyledPicker, StyledTitle } from './styles'
import { AccountPickerProps } from './types'
import { useAccountPicker } from './hook'
import { ellipseText, Icon } from '@aleph-front/core'
import { useTheme } from 'styled-components'
import NetworkSelector from './NetworkSelector'
import { AccountInformation } from './AccountInformation/cmp'
import WalletSelector from './WalletSelector'
import { Portal } from '@/components/common/Portal'
import ExternalUrl from './ExternalUrl'

export const AccountPicker = ({
  isMobile = false,
  showCredits = false,
  showSettings = false,
  showExternalUrl = false,
  accountVouchers,
  settingsContent,
  disabledTopUp,
  handleTopUpClick,
  Link = 'a' as unknown as AccountPickerProps['Link'],
  ...rest
}: AccountPickerProps) => {
  const theme = useTheme()
  const { button, button5 } = theme.component.walletPicker

  const {
    // Wallet picker
    displayWalletPicker,
    walletPickerOpen,
    walletPickerRef,
    walletPickerTriggerRef,
    walletPosition,
    handleDisplayWalletPicker,

    // Networks picker
    displayNetworksPicker,
    networksPickerOpen,
    networksPickerRef,
    networksPickerTriggerRef,
    networksPosition,
    handleDisplayNetworksPicker,

    // Condensed picker
    displayCondensedPicker,
    condensedPickerOpen,
    condensedPickerRef,
    condensedPickerTriggerRef,
    condensedPosition,
    handleDisplayCondensedPicker,

    // Settings picker
    displaySettingsPicker,
    settingsPickerOpen,
    settingsPickerRef,
    settingsPickerTriggerRef,
    settingsPosition,
    handleDisplaySettingsPicker,

    // Account
    accountAddress,
    accountEoaAddress,
    accountCredits,
    accountBalance,
    accountAddressHref,
    accountEoaAddressHref,
    isConnected,
    handleConnect,
    handleDisconnect,

    // Network
    selectedNetwork,
    networks,
    oneNetwork,
    handleSwitchNetwork,

    // Data
    ensName,
    rewards,
    externalUrl,
  } = useAccountPicker(rest)

  return (
    <>
      {!isMobile ? (
        <div tw="flex gap-4">
          <Button
            ref={walletPickerTriggerRef}
            as="button"
            kind={button5.kind}
            color={button5.color}
            variant={button5.variant}
            size="md"
            onClick={handleDisplayWalletPicker}
          >
            <div tw="flex items-center gap-3">
              {accountAddress
                ? ensName || ellipseText(accountAddress, 6, 4)
                : 'Connect Wallet'}
            </div>
          </Button>
          <Button
            ref={networksPickerTriggerRef}
            disabled={oneNetwork}
            as="button"
            kind={button.kind(true)}
            color={button.color(true)}
            variant={button.variant(true)}
            size="md"
            onClick={handleDisplayNetworksPicker}
          >
            <Icon name={selectedNetwork.icon} size="1.5em" prefix="custom" />
          </Button>
          {showSettings && (
            <Button
              ref={settingsPickerTriggerRef}
              as="button"
              kind={button.kind(true)}
              color="base0"
              variant={button.variant(true)}
              size="md"
              onClick={handleDisplaySettingsPicker}
            >
              <Icon name="gear" size="1.1em" tw="p-1" prefix="custom" />
            </Button>
          )}
        </div>
      ) : (
        <>
          <Button
            ref={condensedPickerTriggerRef}
            as="button"
            kind={button5.kind}
            color={button5.color}
            variant={button5.variant}
            size="md"
            onClick={handleDisplayCondensedPicker}
          >
            <div tw="flex items-center gap-3">
              <StyledIcon
                $network={selectedNetwork}
                $isConnected={isConnected}
                $isMobile={isMobile}
              />
            </div>
          </Button>
        </>
      )}
      <Portal>
        {displayWalletPicker && (
          <StyledPicker
            $isOpen={walletPickerOpen}
            $position={walletPosition}
            ref={walletPickerRef}
          >
            {isConnected && (
              <>
                <AccountInformation
                  rewards={rewards}
                  accountAddress={accountAddress}
                  accountAddressHref={accountAddressHref}
                  eoaAddress={accountEoaAddress}
                  eoaAddressHref={accountEoaAddressHref}
                  showCredits={showCredits}
                  credits={accountCredits}
                  balance={accountBalance}
                  vouchers={accountVouchers}
                  disabledTopUp={disabledTopUp}
                  handleTopUpClick={handleTopUpClick}
                  showExternalUrl={showExternalUrl}
                  externalUrl={externalUrl}
                  Link={Link}
                />
                <StyledLine />
              </>
            )}
            <WalletSelector
              isConnected={isConnected}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              selectedNetwork={selectedNetwork}
            />
            {!isConnected && showExternalUrl && externalUrl && (
              <>
                <StyledLine />
                <ExternalUrl
                  Link={Link}
                  text={externalUrl.text}
                  url={externalUrl.url}
                />
              </>
            )}
          </StyledPicker>
        )}
      </Portal>
      <Portal>
        {displayNetworksPicker && (
          <StyledPicker
            ref={networksPickerRef}
            $isOpen={networksPickerOpen}
            $position={networksPosition}
          >
            <NetworkSelector
              networks={networks}
              selectedNetwork={selectedNetwork}
              onSelectNetwork={handleSwitchNetwork}
            />
          </StyledPicker>
        )}
      </Portal>
      <Portal>
        {displayCondensedPicker && (
          <StyledPicker
            ref={condensedPickerRef}
            $isOpen={condensedPickerOpen}
            $position={condensedPosition}
          >
            {!oneNetwork && (
              <>
                {!isConnected && (
                  <StyledTitle>1. Choose your network</StyledTitle>
                )}
                <NetworkSelector
                  networks={networks}
                  selectedNetwork={selectedNetwork}
                  onSelectNetwork={handleSwitchNetwork}
                />
                <StyledLine />
              </>
            )}
            {isConnected ? (
              <>
                <AccountInformation
                  rewards={rewards}
                  accountAddress={accountAddress}
                  accountAddressHref={accountAddressHref}
                  eoaAddress={accountEoaAddress}
                  eoaAddressHref={accountEoaAddressHref}
                  showCredits={showCredits}
                  credits={accountCredits}
                  balance={accountBalance}
                  vouchers={accountVouchers}
                  disabledTopUp={disabledTopUp}
                  handleTopUpClick={handleTopUpClick}
                  showExternalUrl={showExternalUrl}
                  externalUrl={externalUrl}
                  Link={Link}
                />
                <StyledLine />
              </>
            ) : (
              !oneNetwork && <StyledTitle>2. Connect your wallet</StyledTitle>
            )}
            <WalletSelector
              isConnected={isConnected}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              selectedNetwork={selectedNetwork}
            />
            {!isConnected && showExternalUrl && externalUrl && (
              <>
                <StyledLine />
                <ExternalUrl
                  Link={Link}
                  text={externalUrl.text}
                  url={externalUrl.url}
                />
              </>
            )}
          </StyledPicker>
        )}
      </Portal>
      <Portal>
        {displaySettingsPicker && (
          <StyledPicker
            $isOpen={settingsPickerOpen}
            $position={settingsPosition}
            ref={settingsPickerRef}
          >
            {settingsContent}
          </StyledPicker>
        )}
      </Portal>
    </>
  )
}
AccountPicker.displayName = 'AccountPicker'

export default memo(AccountPicker) as typeof AccountPicker
