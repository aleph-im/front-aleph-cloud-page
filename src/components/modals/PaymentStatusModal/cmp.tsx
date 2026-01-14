import React, { memo } from 'react'
import { Button, Icon, TextGradient } from '@aleph-front/core'
import { ALEPH_CREDIT_SENDER, PaymentStatus } from '@/domain/credit'
import {
  PaymentStatusModalContentProps,
  PaymentStatusModalFooterProps,
  PaymentStatusModalHeaderProps,
} from './types'
import {
  StyledProgressContainer,
  StyledProgressStep,
  StyledProgressStepIcon,
  StyledProgressContent,
  StyledProgressTitle,
  StyledProgressDescription,
} from './styles'
import { getETHExplorerURL, getExplorerURL } from '@/helpers/utils'
import BorderBox from '@/components/common/BorderBox'
import { Blockchain } from '@aleph-sdk/core'

const getProgressSteps = (status: PaymentStatus) => {
  const steps = [
    { key: 'transaction', label: 'Your transaction', completed: false },
    { key: 'processing', label: 'Processing', completed: false },
    { key: 'purchase', label: 'Purchase completed', completed: false },
    { key: 'credits', label: 'Credits distributed', completed: false },
  ]

  switch (status) {
    case PaymentStatus.Completed:
      return steps.map((step) => ({ ...step, completed: true }))
    case PaymentStatus.Indexed:
    case PaymentStatus.Broadcasted:
      return steps.map((step, index) => ({ ...step, completed: index <= 2 }))
    case PaymentStatus.Transfered:
      return steps.map((step, index) => ({ ...step, completed: index <= 1 }))
    case PaymentStatus.Processing:
      return steps.map((step, index) => ({ ...step, completed: index === 0 }))
    case PaymentStatus.Failed:
    case PaymentStatus.Cancelled:
    default:
      return steps
  }
}

export const PaymentStatusModalContent = ({
  payment,
}: PaymentStatusModalContentProps) => {
  const progressSteps = getProgressSteps(payment.status)

  const formatTxHash = (txHash?: string) => {
    if (!txHash) return ''
    return `${txHash.slice(0, 20)}...${txHash.slice(-20)}`
  }

  const showWarning =
    payment.status !== PaymentStatus.Completed &&
    Date.now() > payment.createdAt + 60 * 1000

  return (
    <>
      {showWarning && (
        <BorderBox $color="warning" tw="my-4" className="tp-body1">
          The selected payment provider is taking longer than usual to confirm
          your transaction. You can safely close this window—your dashboard will
          update automatically.
        </BorderBox>
      )}
      <StyledProgressContainer>
        {progressSteps.map((step) => (
          <StyledProgressStep key={step.key}>
            <StyledProgressStepIcon
              name={step.key}
              value={step.key}
              checked={step.completed}
              disabled={!step.completed}
              size="xs"
            />
            <StyledProgressContent>
              <StyledProgressTitle completed={step.completed}>
                {step.label}
              </StyledProgressTitle>
              {step.key === 'transaction' && payment.itemHash && (
                <StyledProgressDescription>
                  <a
                    href={getExplorerURL({
                      item_hash: payment.itemHash,
                      chain: Blockchain.ETH,
                      sender: ALEPH_CREDIT_SENDER,
                      type: 'POST',
                    } as any)}
                    target="_blank"
                    rel="noopener noreferrer"
                    tw="inline-flex items-center gap-2"
                  >
                    {formatTxHash(payment.itemHash)}
                    <Icon
                      name="external-link-square-alt"
                      size="12px"
                      color="purple4"
                    />
                  </a>
                </StyledProgressDescription>
              )}
              {step.key === 'purchase' && payment.txHash && (
                <StyledProgressDescription>
                  <a
                    href={getETHExplorerURL({ hash: payment.txHash })}
                    target="_blank"
                    rel="noopener noreferrer"
                    tw="inline-flex items-center gap-2"
                  >
                    {formatTxHash(payment.txHash)}
                    <Icon
                      name="external-link-square-alt"
                      size="12px"
                      color="purple4"
                    />
                  </a>
                </StyledProgressDescription>
              )}
            </StyledProgressContent>
          </StyledProgressStep>
        ))}
      </StyledProgressContainer>
    </>
  )
}
PaymentStatusModalContent.displayName = 'PaymentStatusModalContent'

export default memo(PaymentStatusModalContent)

// --------------

export const PaymentStatusModalHeader = memo(
  ({ payment }: PaymentStatusModalHeaderProps) => {
    const isCompleted = payment.status === PaymentStatus.Completed

    return (
      <div>
        <TextGradient type="h6" forwardedAs="h2" tw="mb-2">
          {isCompleted ? 'Purchase complete' : 'Purchase in progress'}
        </TextGradient>
        <p tw="m-0">
          {isCompleted
            ? 'The transaction has been completed processing.'
            : 'The transaction is being processed at the moment'}
        </p>
      </div>
    )
  },
)

PaymentStatusModalHeader.displayName = 'PaymentStatusModalHeader'

// --------------

export const PaymentStatusModalFooter = memo(
  ({ payment, onClose }: PaymentStatusModalFooterProps) => {
    return (
      <div tw="flex justify-between items-center">
        <Button
          variant="textOnly"
          size="sm"
          className="text-base2"
          onClick={() => {
            console.log('Report issue for payment:', payment.id)
          }}
        >
          Report issue
        </Button>
        <Button variant="primary" size="md" onClick={onClose}>
          Close
        </Button>
      </div>
    )
  },
)

PaymentStatusModalFooter.displayName = 'PaymentStatusModalFooter'
