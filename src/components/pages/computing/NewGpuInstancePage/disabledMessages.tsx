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

export function holderTierNotSupportedMessage(): TooltipProps['content'] {
  return tooltipContent({
    title: `Holder Tier not supported`,
    description: `GPU Instances only support Pay-as-you-go.`,
  })
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

export function unsupportedHoldingDisabledMessage(
  blockchainName: string,
): TooltipProps['content'] {
  return tooltipContent({
    title: `Payment Method not supported`,
    description: (
      <>
        {blockchainName} doesn&apos;t support Holder tier payment method. Please
        switch the chain using the dropdown at the top of the page.
      </>
    ),
  })
}

export function unsupportedStreamDisabledMessage(
  blockchainName: string,
): TooltipProps['content'] {
  return tooltipContent({
    title: `Payment Method not supported`,
    description: (
      <>
        {blockchainName} supports only the Holder tier payment method. To use
        the Pay-As-You-Go tier, please switch to the <strong>Base</strong> or{' '}
        <strong>Avalanche</strong> chain using the dropdown at the top of the
        page.
      </>
    ),
  })
}

export function unsupportedStreamManualCRNSelectionDisabledMessage(
  blockchainName: string,
): TooltipProps['content'] {
  return tooltipContent({
    title: `Manual CRN Selection Unavailable`,
    description: (
      <>
        Manual selection of CRN is not supported on {blockchainName}. To access
        manual CRN selection, please switch to the <strong>Base</strong> or{' '}
        <strong>Avalanche</strong> chain using the dropdown at the top of the
        page.
      </>
    ),
  })
}

export function unsupportedManualCRNSelectionDisabledMessage(): TooltipProps['content'] {
  return tooltipContent({
    title: `Feature Unavailable in Holder Tier`,
    description: (
      <>
        Manual CRN selection is disabled in the Holder tier. Switch to the{' '}
        <strong>Pay-As-You-Go</strong> tier to enable manual selection of CRNs.
      </>
    ),
  })
}
