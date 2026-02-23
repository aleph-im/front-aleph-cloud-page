import React, { memo } from 'react'

export const HoldTokenDisclaimer = () => {
  return (
    <p tw="my-24 text-center">
      Aleph Cloud runs on a credit-based system, designed for flexibility and
      transparency. You can top up credits with fiat, USDC, or ALEPH. Your
      credits are deducted only as you consume resources, ensuring you pay
      exactly for what you use. If your credit balance runs out, resources will
      be automatically reclaimed.
    </p>
  )
}
HoldTokenDisclaimer.displayName = 'HoldTokenDisclaimer'

export default memo(HoldTokenDisclaimer)
