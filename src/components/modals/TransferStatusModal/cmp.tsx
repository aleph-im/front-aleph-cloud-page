import React, { memo, useCallback, useEffect, useMemo } from 'react'
import 'twin.macro'
import { Button, Icon, Modal, Spinner, TextGradient } from '@aleph-front/core'
import { useAppState } from '@/contexts/appState'
import { closeTransferStatusModal, triggerCreditDataRefresh } from '@/store/ui'
import {
  useTransferStatus,
  TransferStatus,
} from '@/hooks/common/useTransferStatus'
import BorderBox from '@/components/common/BorderBox'
import {
  StyledProgressContainer,
  StyledProgressStep,
  StyledProgressStepIcon,
  StyledProgressContent,
  StyledProgressTitle,
  StyledProgressDescription,
} from '@/components/modals/PaymentStatusModal/styles'

const stepDefinitions = [
  {
    key: 'sent',
    pendingLabel: 'Submit transfer',
    currentLabel: 'Submitting transfer',
    completedLabel: 'Transfer submitted',
    description:
      'Signing and sending the transfer message to the Aleph network.',
  },
  {
    key: 'processed',
    pendingLabel: 'Process transfer',
    currentLabel: 'Processing transfer',
    completedLabel: 'Transfer processed',
    description: 'The network is verifying and processing the credit transfer.',
  },
]

const getProgressSteps = (status: TransferStatus) => {
  let completedCount = 0
  switch (status) {
    case 'processed':
      completedCount = 2
      break
    case 'pending':
      completedCount = 1
      break
    default:
      completedCount = 0
      break
  }

  const isFinal = status === 'processed' || status === 'rejected'

  return stepDefinitions.map((step, index) => ({
    ...step,
    completed: index < completedCount,
    current: !isFinal && index === completedCount,
  }))
}

const TransferStatusModal = () => {
  const [state, dispatch] = useAppState()
  const { isTransferStatusModalOpen: isOpen, transferStatusItemHash } = state.ui
  const accountAddress = state.connection.account?.address

  const { status, startPolling, stopPolling } = useTransferStatus()

  useEffect(() => {
    if (isOpen && transferStatusItemHash) {
      startPolling(transferStatusItemHash)
    }
    return () => {
      stopPolling()
    }
  }, [isOpen, transferStatusItemHash, startPolling, stopPolling])

  // Refresh all credit data when transfer is processed
  useEffect(() => {
    if (status === 'processed') {
      dispatch(triggerCreditDataRefresh())
    }
  }, [status, dispatch])

  const handleClose = useCallback(() => {
    stopPolling()
    dispatch(closeTransferStatusModal())
  }, [dispatch, stopPolling])

  const progressSteps = useMemo(() => getProgressSteps(status), [status])

  const isCompleted = status === 'processed'
  const isError = status === 'rejected'

  const formatHash = (hash?: string) => {
    if (!hash) return ''
    return `${hash.slice(0, 16)}...${hash.slice(-8)}`
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      width="36rem"
      header={
        <div>
          <TextGradient type="h6" forwardedAs="h2" tw="mb-2">
            {isCompleted
              ? 'Transfer complete'
              : isError
                ? 'Transfer failed'
                : 'Transfer in progress'}
          </TextGradient>
          <p tw="m-0">
            {isCompleted
              ? 'Credits have been successfully transferred.'
              : isError
                ? 'The transfer was rejected by the network.'
                : 'Your transfer is being processed on the network.'}
          </p>
        </div>
      }
      content={
        <>
          {isCompleted && (
            <BorderBox $color="main0" tw="my-4" className="tp-body1">
              Credits have been successfully transferred to the recipient
              account.
            </BorderBox>
          )}
          {isError && (
            <BorderBox $color="error" tw="my-4" className="tp-body1">
              The transfer was rejected. Please check the recipient address and
              your balance, then try again.
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
                  <StyledProgressTitle
                    completed={step.completed || step.current}
                  >
                    {step.completed
                      ? step.completedLabel
                      : step.current
                        ? step.currentLabel
                        : step.pendingLabel}
                  </StyledProgressTitle>
                  {step.key === 'sent' && transferStatusItemHash && (
                    <StyledProgressDescription>
                      <a
                        href={`https://explorer.aleph.im/address/ETH/${accountAddress}/message/POST/${transferStatusItemHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        tw="inline-flex items-center gap-2"
                      >
                        {formatHash(transferStatusItemHash)}
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
      }
      footer={
        <div tw="flex justify-end">
          <Button variant="primary" size="md" onClick={handleClose}>
            Close
          </Button>
        </div>
      }
    />
  )
}
TransferStatusModal.displayName = 'TransferStatusModal'

export default memo(TransferStatusModal)
