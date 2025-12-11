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

export function accountConnectionRequiredDisabledMessage(
  actionDescription: string,
): TooltipProps['content'] {
  return tooltipContent({
    title: `Account connection required`,
    description: `Please connect your account to ${actionDescription}.
                  Connect your wallet using the top-right button to access all features.`,
  })
}
