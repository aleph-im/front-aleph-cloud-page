import React, { useMemo } from 'react'
import { TooltipProps } from '@aleph-front/core'
import { isBlockchainSupported as isBlockchainPAYGCompatible } from '@aleph-sdk/superfluid'
import { PaymentMethod } from '@/helpers/constants'
import { isBlockchainHoldingCompatible } from '@/domain/blockchain'
import { BlockchainId } from '@/domain/connect'

// -------------------------
// Types

export type DisabledMessageInfo = {
  title: React.ReactNode
  description: React.ReactNode
}

export type DisabledMessage = {
  tooltipContent: TooltipProps['content']
  info: DisabledMessageInfo
}

// -------------------------
// Message factory

function createDisabledMessage(
  title: React.ReactNode,
  description: React.ReactNode,
): DisabledMessage {
  return {
    tooltipContent: (
      <div>
        <p className="tp-body3 fs-18 text-base2">{title}</p>
        <p className="tp-body1 fs-14 text-base2">{description}</p>
      </div>
    ),
    info: {
      title,
      description,
    },
  }
}

// -------------------------
// Disabled message functions

export function accountConnectionRequiredDisabledMessage(
  actionDescription: string,
): DisabledMessage {
  return createDisabledMessage(
    'Account connection required',
    `Please connect your account to ${actionDescription}. Connect your wallet using the top-right button to access all features.`,
  )
}

export function unsupportedHoldingDisabledMessage(
  blockchainName: string,
): DisabledMessage {
  return createDisabledMessage(
    'Payment Method not supported',
    `${blockchainName} doesn't support Holder tier payment method. Please switch the chain using the dropdown at the top of the page.`,
  )
}

export function unsupportedStreamDisabledMessage(
  blockchainName: string,
): DisabledMessage {
  return createDisabledMessage(
    'Selected chain not supported',
    <>
      {blockchainName} supports only the Holder tier payment method. To use the{' '}
      <strong>Pay-As-You-Go</strong> tier, please switch to the{' '}
      <strong>Base</strong> or <strong>Avalanche</strong> chain using the
      dropdown at the top of the page.
    </>,
  )
}

export function unsupportedStreamManualCRNSelectionDisabledMessage(
  blockchainName: string,
): DisabledMessage {
  return createDisabledMessage(
    'Manual CRN Selection Unavailable',
    <>
      Manual selection of CRN is not supported on {blockchainName}. To access
      manual CRN selection, please switch to the <strong>Base</strong> or{' '}
      <strong>Avalanche</strong> chain using the dropdown at the top of the
      page.
    </>,
  )
}

export function unsupportedManualCRNSelectionDisabledMessage(): DisabledMessage {
  return createDisabledMessage(
    'Feature Unavailable in Holder Tier',
    <>
      Manual CRN selection is disabled in the Holder tier. Switch to the{' '}
      <strong>Pay-As-You-Go</strong> tier to enable manual selection of CRNs.
    </>,
  )
}

export function holderTierUnavailableDisabledMessage(): DisabledMessage {
  return createDisabledMessage(
    'All Holder tier resources are currently in use.',
    <>
      You can try again later or continue with <strong>Pay-As-You-Go</strong>.
    </>,
  )
}

export function schedulerLoadingDisabledMessage(): DisabledMessage {
  return createDisabledMessage(
    'Checking availability...',
    'Please wait while we verify resource availability for the Holder tier.',
  )
}

// GPU-specific message
export function holderTierNotSupportedMessage(): DisabledMessage {
  return createDisabledMessage(
    'Holder Tier not supported',
    'GPU Instances only support Pay-as-you-go.',
  )
}

// -------------------------
// Hook

export type UseCreateInstanceDisabledMessageProps = {
  paymentMethod: PaymentMethod
  blockchain?: BlockchainId
  blockchainName: string
  isSchedulerAvailable: boolean
  isSchedulerLoading: boolean
}

export type UseCreateInstanceDisabledMessageReturn = {
  createInstanceDisabledMessage?: TooltipProps['content']
  createInstanceDisabledMessageInfo?: DisabledMessageInfo
}

export function useCreateInstanceDisabledMessage({
  paymentMethod,
  blockchain,
  blockchainName,
  isSchedulerAvailable,
  isSchedulerLoading,
}: UseCreateInstanceDisabledMessageProps): UseCreateInstanceDisabledMessageReturn {
  return useMemo(() => {
    // Checks configuration for PAYG tier
    if (paymentMethod === PaymentMethod.Stream) {
      if (!isBlockchainPAYGCompatible(blockchain)) {
        const msg = unsupportedStreamDisabledMessage(blockchainName)
        return {
          createInstanceDisabledMessage: msg.tooltipContent,
          createInstanceDisabledMessageInfo: msg.info,
        }
      }
    }

    // Checks configuration for Holder tier
    if (paymentMethod === PaymentMethod.Hold) {
      if (!isBlockchainHoldingCompatible(blockchain)) {
        const msg = unsupportedHoldingDisabledMessage(blockchainName)
        return {
          createInstanceDisabledMessage: msg.tooltipContent,
          createInstanceDisabledMessageInfo: msg.info,
        }
      }

      // Check scheduler availability for holder tier
      if (isSchedulerLoading) {
        const msg = schedulerLoadingDisabledMessage()
        return {
          createInstanceDisabledMessage: msg.tooltipContent,
          createInstanceDisabledMessageInfo: msg.info,
        }
      }

      if (!isSchedulerAvailable) {
        const msg = holderTierUnavailableDisabledMessage()
        return {
          createInstanceDisabledMessage: msg.tooltipContent,
          createInstanceDisabledMessageInfo: msg.info,
        }
      }
    }

    return {
      createInstanceDisabledMessage: undefined,
      createInstanceDisabledMessageInfo: undefined,
    }
  }, [
    paymentMethod,
    blockchain,
    blockchainName,
    isSchedulerAvailable,
    isSchedulerLoading,
  ])
}
