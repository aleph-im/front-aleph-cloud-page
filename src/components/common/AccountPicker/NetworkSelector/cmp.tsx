import React, { memo, useCallback } from 'react'
import tw from 'twin.macro'
import { Col, Row, Button, Icon } from '@aleph-front/core'
import { NetworkPickerProps, NetworkSelectorProps } from './types'
import { useTheme } from 'styled-components'

const NetworkPicker = ({
  network,
  isSelected,
  onClick,
}: NetworkPickerProps) => {
  const theme = useTheme()
  const { color, button } = theme.component.walletPicker

  const handleClick = useCallback(() => {
    onClick && onClick(network)
  }, [network, onClick])

  return (
    <div tw="text-center min-w-[3.25rem]">
      <Button
        onClick={handleClick}
        disabled={network.wallets.length === 0}
        size="md"
        tw="relative"
        kind={button.kind(isSelected)}
        color={button.color(isSelected)}
        variant={button.variant(isSelected)}
      >
        {!isSelected && (
          <div
            tw="absolute! h-full w-full inset-0 -z-10"
            className="fx-noise-base"
          />
        )}
        <Icon name={network.icon} size="xl" tw="w-6" prefix="custom" />
      </Button>
      <div
        className="fs-10"
        css={[
          tw`mt-1`,
          {
            color: !isSelected ? color.disabled : color.default,
          },
        ]}
      >
        {network.name}
      </div>
    </div>
  )
}
NetworkPicker.displayName = 'NetworkPicker'

// --------------------------------

export const NetworkSelector = ({
  networks,
  selectedNetwork,
  onSelectNetwork,
}: NetworkSelectorProps) => {
  const rowsCount = networks.length < 4 ? networks.length : 4

  return (
    <Row count={rowsCount} gap="0.75rem">
      {networks.map((network) => (
        <Col key={network.name}>
          <NetworkPickerMemo
            {...{
              network,
              isSelected: selectedNetwork?.id === network.id,
              onClick: onSelectNetwork,
            }}
          />
        </Col>
      ))}
    </Row>
  )
}

NetworkSelector.displayName = 'NetworkSelector'

const NetworkPickerMemo = memo(NetworkPicker) as typeof NetworkPicker

export default memo(NetworkSelector) as typeof NetworkSelector
