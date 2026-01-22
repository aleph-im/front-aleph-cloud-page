import React, { memo } from 'react'
import { Button, Icon, Spinner, TextGradient } from '@aleph-front/core'
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
import { useReportIssueModal } from '@/components/modals/ReportIssueModal'

type ProgressStep = {
  key: string
  pendingLabel: string
  currentLabel: string
  completedLabel: string
  completed: boolean
  current: boolean
}

type StepDefinition = {
  key: string
  pendingLabel: string
  currentLabel: string
  completedLabel: string
}

const stepDefinitions: StepDefinition[] = [
  {
    key: 'transaction',
    pendingLabel: 'Submit transaction',
    currentLabel: 'Submitting transaction',
    completedLabel: 'Transaction submitted',
  },
  {
    key: 'processing',
    pendingLabel: 'Process payment',
    currentLabel: 'Processing payment',
    completedLabel: 'Payment processed',
  },
  {
    key: 'purchase',
    pendingLabel: 'Complete purchase',
    currentLabel: 'Completing purchase',
    completedLabel: 'Purchase completed',
  },
  {
    key: 'credits',
    pendingLabel: 'Distribute credits',
    currentLabel: 'Distributing credits',
    completedLabel: 'Credits distributed',
  },
]

const getProgressSteps = (status: PaymentStatus): ProgressStep[] => {
  let completedCount = 0
  switch (status) {
    case PaymentStatus.Completed:
      completedCount = 4
      break
    case PaymentStatus.Indexed:
    case PaymentStatus.Broadcasted:
      completedCount = 3
      break
    case PaymentStatus.Transfered:
      completedCount = 2
      break
    case PaymentStatus.Processing:
      completedCount = 1
      break
    case PaymentStatus.Failed:
    case PaymentStatus.Cancelled:
    default:
      completedCount = 0
      break
  }

  const isFinalState =
    status === PaymentStatus.Completed ||
    status === PaymentStatus.Failed ||
    status === PaymentStatus.Cancelled

  return stepDefinitions.map((step, index) => ({
    ...step,
    completed: index < completedCount,
    current: !isFinalState && index === completedCount,
  }))
}

const getStepLabel = (step: ProgressStep): string => {
  if (step.completed) return step.completedLabel
  if (step.current) return step.currentLabel
  return step.pendingLabel
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
    Date.now() > payment.createdAt + 1000 * 60 * 5

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
            {step.current ? (
              <Spinner size="3rem" color="main0" tw="-m-4" />
            ) : (
              <StyledProgressStepIcon
                name={step.key}
                value={step.key}
                checked={step.completed}
                disabled={!step.completed}
                size="xs"
              />
            )}
            <StyledProgressContent>
              <StyledProgressTitle completed={step.completed || step.current}>
                {getStepLabel(step)}
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
    const { handleOpen: handleOpenReportIssue } = useReportIssueModal()

    return (
      <div tw="flex justify-between items-center">
        <Button
          variant="textOnly"
          size="sm"
          className="text-base2"
          onClick={() => handleOpenReportIssue({ paymentId: payment.id })}
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
