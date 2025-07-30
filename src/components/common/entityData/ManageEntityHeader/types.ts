import { Executable, ExecutableCalculatedStatus } from '@/domain/executable'

export type ManageEntityHeaderProps = {
  name: string
  isAllocated: boolean
  entity?: Executable
  type: 'instance' | 'function' | 'GPU instance' | 'confidential instance'

  calculatedStatus: ExecutableCalculatedStatus

  // Stop action
  showStop?: boolean
  stopDisabled?: boolean
  onStop?: () => void

  // Start action
  showStart?: boolean
  startDisabled?: boolean
  onStart?: () => void

  // Reboot action
  showReboot?: boolean
  rebootDisabled?: boolean
  onReboot?: () => void

  // Delete action
  showDelete?: boolean
  deleteDisabled?: boolean
  onDelete?: () => void

  // Download action
  showDownload?: boolean
  downloadDisabled?: boolean
  onDownload?: () => void

  // Go back action
  onBack: () => void
}
