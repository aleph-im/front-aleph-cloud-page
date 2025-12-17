import React, { memo } from 'react'
import { Button, Icon } from '@aleph-front/core'
import { PaymentStatus } from '@/domain/credit'
import { PaymentStatusModalProps } from './types'

const getProgressSteps = (status: PaymentStatus) => {
  const steps = [
    { key: 'transaction', label: 'Your transaction', completed: false },
    { key: 'processed', label: 'Processed', completed: false },
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
      return steps
    default:
      return steps
  }
}

export const PaymentStatusModal = ({
  payment,
  onClose,
}: PaymentStatusModalProps) => {
  const progressSteps = getProgressSteps(payment.status)
  const isCompleted = payment.status === PaymentStatus.Completed

  const formatTxHash = (txHash?: string) => {
    if (!txHash) return ''
    return `${txHash.slice(0, 20)}...${txHash.slice(-20)}`
  }

  const getExplorerUrl = (txHash?: string) => {
    if (!txHash) return ''
    return `https://explorer.aleph.im/address/ETH/${txHash}`
  }

  return (
    <div tw="p-6 max-w-md">
      <div tw="text-center mb-6">
        <h2 className="tp-h6 text-main0 mb-2">
          {isCompleted ? 'Purchase complete' : 'Purchase in progress'}
        </h2>
        <p className="tp-body2 text-base2">
          {isCompleted
            ? 'The transaction has been completed processing.'
            : 'Your transaction is being processed.'}
        </p>
      </div>

      <div tw="space-y-4 mb-6">
        {progressSteps.map((step) => (
          <div key={step.key} tw="flex items-start gap-3">
            <div tw="flex-shrink-0 mt-0.5">
              <Icon
                name={step.completed ? 'check' : 'circle'}
                color={step.completed ? 'success' : 'base2'}
                size="16px"
              />
            </div>
            <div tw="flex-1">
              <p
                className={`tp-body2 ${step.completed ? 'text-main0' : 'text-base2'}`}
              >
                {step.label}
              </p>
              {step.key === 'transaction' && payment.txHash && (
                <a
                  href={getExplorerUrl(payment.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tp-info text-main2 hover:text-main0"
                  tw="inline-flex items-center gap-1 mt-1 transition-colors"
                >
                  <span>{formatTxHash(payment.txHash)}</span>
                  <Icon name="external-link-square-alt" size="12px" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div tw="flex justify-between items-center pt-4 border-t border-gray-200">
        <Button
          variant="textOnly"
          size="sm"
          className="text-base2"
          onClick={() => {
            // TODO: Implement report issue functionality
            console.log('Report issue for payment:', payment.id)
          }}
        >
          Report issue
        </Button>
        <Button variant="primary" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}

PaymentStatusModal.displayName = 'PaymentStatusModal'

export default memo(PaymentStatusModal)
