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

export function unsupportedNetworkDisabledMessage(
  blockchainName: string,
): TooltipProps['content'] {
  return tooltipContent({
    title: `Ethereum network required`,
    description: (
      <>
        {blockchainName} doesn&apos;t support this action. Please switch to the{' '}
        <strong>Ethereum</strong> chain using the dropdown at the top of the
        page.
      </>
    ),
  })
}
