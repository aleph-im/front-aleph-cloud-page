import React, { memo } from 'react'
import { Button, Modal, TextArea, TextGradient } from '@aleph-front/core'
import { useReportIssueModal, useReportIssueModalForm } from './hook'

export const ReportIssueModal = () => {
  const { isOpen, metadata, handleClose } = useReportIssueModal()
  const { message, setMessage, handleSubmit, isSubmitting, error } =
    useReportIssueModalForm(metadata, handleClose)

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      width="30rem"
      header={<ReportIssueModalHeader />}
      content={
        <ReportIssueModalContent
          message={message}
          setMessage={setMessage}
          error={error}
        />
      }
      footer={
        <ReportIssueModalFooter
          onSubmit={handleSubmit}
          onClose={handleClose}
          disabled={!message.trim() || isSubmitting}
          isSubmitting={isSubmitting}
        />
      }
    />
  )
}

ReportIssueModal.displayName = 'ReportIssueModal'

export default memo(ReportIssueModal)

// --------

const ReportIssueModalHeader = memo(() => {
  return (
    <div>
      <TextGradient type="h6" forwardedAs="h2" tw="mb-2">
        Report an Issue
      </TextGradient>
      <p tw="m-0">Describe the issue you encountered.</p>
    </div>
  )
})
ReportIssueModalHeader.displayName = 'ReportIssueModalHeader'

// --------

interface ReportIssueModalContentProps {
  message: string
  setMessage: (message: string) => void
  error?: string
}

const ReportIssueModalContent = memo(
  ({ message, setMessage, error }: ReportIssueModalContentProps) => {
    return (
      <div tw="flex flex-col gap-4">
        <TextArea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe the issue..."
          tw="min-h-[8rem]"
        />
        {error && (
          <p className="tp-body3 text-error" tw="m-0">
            {error}
          </p>
        )}
      </div>
    )
  },
)
ReportIssueModalContent.displayName = 'ReportIssueModalContent'

// --------

interface ReportIssueModalFooterProps {
  onSubmit: () => void
  onClose: () => void
  disabled: boolean
  isSubmitting: boolean
}

const ReportIssueModalFooter = memo(
  ({
    onSubmit,
    onClose,
    disabled,
    isSubmitting,
  }: ReportIssueModalFooterProps) => {
    return (
      <div tw="flex justify-between items-center">
        <Button
          variant="textOnly"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onSubmit}
          disabled={disabled}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    )
  },
)
ReportIssueModalFooter.displayName = 'ReportIssueModalFooter'
