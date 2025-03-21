import React, { memo } from 'react'
import { Logo, NoisyContainer } from '@aleph-front/core'
import { EntityPaymentProps } from './types'

export const EntityPayment = ({ cost }: EntityPaymentProps) => {
  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        PAYMENT
      </div>
      <NoisyContainer>
        <div tw="flex items-center gap-4">
          <div
            className="bg-main0 text-base0"
            tw="flex items-center gap-1 px-3 py-1"
          >
            <Logo img="aleph" color="base0" byAleph={false} />
            <div tw="uppercase font-bold leading-relaxed">ALEPH</div>
          </div>
          <p className="text-base2 fs-18" tw="font-bold">
            {cost}
          </p>
        </div>
      </NoisyContainer>
    </>
  )
}
EntityPayment.displayName = 'EntityPayment'

export default memo(EntityPayment) as typeof EntityPayment
