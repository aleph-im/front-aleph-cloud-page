import React, { memo } from 'react'

export const HoldTokenDisclaimer = () => {
  return (
    <p tw="my-24 text-center">
      Acquire Aleph Cloud tokens for versatile access to resources within a
      defined duration. These tokens remain in your wallet without being locked
      or consumed, providing you with flexibility in utilizing Aleph
      Cloud&apos;s infrastructure. If you choose to remove the tokens from your
      wallet, the allocated resources will be efficiently reclaimed. Feel free
      to use or hold the tokens according to your needs, even when not actively
      using Aleph Cloud&apos;s resources.
    </p>
  )
}
HoldTokenDisclaimer.displayName = 'HoldTokenDisclaimer'

export default memo(HoldTokenDisclaimer)
