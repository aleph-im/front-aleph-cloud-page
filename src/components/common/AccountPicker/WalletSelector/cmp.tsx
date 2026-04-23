import React, { memo } from 'react'
import { Col, Row } from '@aleph-front/core'
import {
  Wallet,
  WalletSelectorConnectedProps,
  WalletSelectorDisconnectedProps,
  WalletSelectorProps,
} from './types'
import WalletIcon from './icons'
import { Button, ToggleContainer } from '@aleph-front/core'
import { useTheme } from 'styled-components'

const WalletSelectorDisconnected = ({
  selectedNetwork,
  onConnect,
}: WalletSelectorDisconnectedProps) => {
  const theme = useTheme()
  const { button2 } = theme.component.walletPicker

  return (
    <div>
      <ToggleContainer open={!!selectedNetwork?.wallets}>
        <Row count={1}>
          {selectedNetwork?.wallets?.map((wallet: Wallet) => (
            <Col key={wallet.name}>
              <div tw="block text-center">
                <Button
                  onClick={() => onConnect(wallet, selectedNetwork)}
                  as="button"
                  size="md"
                  kind={button2.kind}
                  variant={button2.variant}
                  color={button2.color}
                >
                  {wallet.name}
                  <WalletIcon
                    tw="ml-2.5"
                    name={wallet.icon}
                    color={button2.iconColor || wallet.color}
                  />
                </Button>
              </div>
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
