export type ReportIssueMetadata = Record<string, unknown>

export interface ReportIssuePayload {
  reporter: string
  description: string
  metadata?: ReportIssueMetadata
}

export interface UseReportIssueModalReturn {
  isOpen: boolean
  metadata?: ReportIssueMetadata
  handleOpen: (metadata?: ReportIssueMetadata) => void
  handleClose: () => void
}

export interface UseReportIssueModalFormReturn {
  message: string
  setMessage: (message: string) => void
  handleSubmit: () => void
  isSubmitting: boolean
  error?: string
}
