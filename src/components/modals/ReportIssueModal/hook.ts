import { useCallback, useState } from 'react'
import { useAppState } from '@/contexts/appState'
import { openReportIssueModal, closeReportIssueModal } from '@/store/ui'
import {
  UseReportIssueModalReturn,
  UseReportIssueModalFormReturn,
  ReportIssuePayload,
  ReportIssueMetadata,
} from './types'

const REPORT_ISSUE_ENDPOINT = 'https://n8n.aleph.im/webhook/report-issue'

export function useReportIssueModal(): UseReportIssueModalReturn {
  const [state, dispatch] = useAppState()

  const isOpen = state.ui.isReportIssueModalOpen
  const metadata = state.ui.reportIssueMetadata

  const handleOpen = useCallback(
    (metadata?: ReportIssueMetadata) => {
      dispatch(openReportIssueModal(metadata))
    },
    [dispatch],
  )

  const handleClose = useCallback(() => {
    dispatch(closeReportIssueModal())
  }, [dispatch])

  return {
    isOpen,
    metadata,
    handleOpen,
    handleClose,
  }
}

export function useReportIssueModalForm(
  metadata?: ReportIssueMetadata,
  onClose?: () => void,
): UseReportIssueModalFormReturn {
  const [state] = useAppState()
  const { account } = state.connection

  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const handleSubmit = useCallback(async () => {
    if (!account?.address) {
      setError('Wallet not connected')
      return
    }

    if (!message.trim()) {
      setError('Please provide a description')
      return
    }

    setIsSubmitting(true)
    setError(undefined)

    const payload: ReportIssuePayload = {
      reporter: account.address,
      description: message.trim(),
      metadata: {
        ...metadata,
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: Date.now(),
      },
    }

    try {
      const response = await fetch(REPORT_ISSUE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Failed to submit report: ${response.statusText}`)
      }

      setMessage('')
      onClose?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report')
    } finally {
      setIsSubmitting(false)
    }
  }, [account?.address, message, metadata, onClose])

  return {
    message,
    setMessage,
    handleSubmit,
    isSubmitting,
    error,
  }
}
