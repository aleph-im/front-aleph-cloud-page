import { TooltipProps } from '@aleph-front/core'
import React from 'react'

type DisabledMessageProps = {
  title: React.ReactNode
  description: React.ReactNode
}

function tooltipContent({
  title,
  description,
}: DisabledMessageProps): TooltipProps['content'] {
  return (
    <div>
      <p className="tp-body3 fs-18 text-base2">{title}</p>
      <p className="tp-body1 fs-14 text-base2">{description}</p>
    </div>
  )
}

export function insufficientFundsDisabledMessage(): TooltipProps['content'] {
  return tooltipContent({
    title: `Insufficient Credits`,
    description: `You don't have enough credits in your account to create this volume. Please top up your credits to continue.`,
  })
}
