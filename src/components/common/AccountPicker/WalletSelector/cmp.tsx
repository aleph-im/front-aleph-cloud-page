import React, { memo, useRef } from 'react'
import { Col, Row } from '@aleph-front/core'
import {
  Wallet,
  WalletSelectorConnectedProps,
  WalletSelectorDisconnectedProps,
  WalletSelectorProps,
} from './types'
import WalletIcon from './icons'
import { Button, ToggleContainer, Tooltip } from '@aleph-front/core'
import { useTheme } from 'styled-components'
import { Network } from '../NetworkSelector'

type WalletButtonProps = {
  wallet: Wallet
  selectedNetwork: Network
  onConnect: (wallet: Wallet, network: Network) => void
}

const WalletButton = ({
  wallet,
  selectedNetwork,
  onConnect,
}: WalletButtonProps) => {
  const theme = useTheme()
  const { button2 } = theme.component.walletPicker
  const triggerRef = useRef<HTMLDivElement>(null)

  return (
    <div tw="block text-center">
      <div ref={triggerRef} tw="inline-block">
        <Button
          onClick={() => !wallet.disabled && onConnect(wallet, selectedNetwork)}
          as="button"
          size="md"
          kind={button2.kind}
          variant={button2.variant}
          color={button2.color}
          disabled={wallet.disabled}
        >
          {wallet.name}
          <WalletIcon
            tw="ml-2.5"
            name={wallet.icon}
            color={button2.iconColor || wallet.color}
          />
        </Button>
      </div>
      {wallet.disabled && wallet.disabledTooltip && (
        <Tooltip
          my="bottom-center"
          at="top-center"
          targetRef={triggerRef}
          content={wallet.disabledTooltip}
        />
      )}
    </div>
  )
}
WalletButton.displayName = 'WalletButton'

const WalletButtonMemo = memo(WalletButton) as typeof WalletButton

// --------------------------------

const WalletSelectorDisconnected = ({
  selectedNetwork,
  onConnect,
}: WalletSelectorDisconnectedProps) => {
  return (
    <div>
      <ToggleContainer open={!!selectedNetwork?.wallets}>
        <Row count={1}>
          {selectedNetwork?.wallets?.map((wallet: Wallet) => (
            <Col key={wallet.name}>
              <WalletButtonMemo
                wallet={wallet}
                selectedNetwork={selectedNetwork}
                onConnect={onConnect}
              />
            </Col>
          ))}
        </Row>
      </ToggleContainer>
    </div>
  )
}
WalletSelectorDisconnected.displayName = 'WalletSelectorDisconnected'

const WalletSelectorConnected = ({
  onDisconnect,
}: WalletSelectorConnectedProps) => {
  const theme = useTheme()
  const { button4 } = theme.component.walletPicker

  return (
    <div tw="text-center">
      <Button
        size="md"
        kind={button4.kind}
        variant={button4.variant}
        color={button4.color}
        onClick={onDisconnect}
      >
        Disconnect
      </Button>
    </div>
  )
}
WalletSelectorConnected.displayName = 'WalletSelectorConnected'

export const WalletSelector = ({
  isConnected = false,
  selectedNetwork,
  onConnect,
  onDisconnect,
}: WalletSelectorProps) => {
  return (
    <>
      {isConnected ? (
        <WalletSelectorConnectedMemo
          {...{
            selectedNetwork,
            onDisconnect,
          }}
        />
      ) : (
        <WalletSelectorDisconnectedMemo
          {...{
            onConnect,
            selectedNetwork,
          }}
        />
      )}
    </>
  )
}
WalletSelector.displayName = 'WalletSelector'

const WalletSelectorDisconnectedMemo = memo(
  WalletSelectorDisconnected,
) as typeof WalletSelectorDisconnected

const WalletSelectorConnectedMemo = memo(
  WalletSelectorConnected,
) as typeof WalletSelectorConnected

export default memo(WalletSelector) as typeof WalletSelector
