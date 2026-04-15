export type TransferStatusModalProps = Record<string, never>

export type TransferStatusStep = {
  key: string
  pendingLabel: string
  currentLabel: string
  completedLabel: string
  completed: boolean
  current: boolean
}
