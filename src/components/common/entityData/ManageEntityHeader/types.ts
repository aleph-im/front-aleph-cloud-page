import { Executable, ExecutableCalculatedStatus } from '@/domain/executable'
import { PaymentData } from '@/components/common/entityData/EntityPayment/types'

export type ManageEntityHeaderProps = {
  name: string
  isAllocated: boolean
  entity?: Executable
  type: 'instance' | 'function' | 'GPU instance' | 'TEE instance'

  calculatedStatus: ExecutableCalculatedStatus

  // Credit balance
  creditBalance?: number

  // Payment data
  paymentData?: PaymentData[]

  // Stop action
  showStop?: boolean
  stopDisabled?: boolean
  stopLoading?: boolean
  onStop?: () => void

  // Start action
  showStart?: boolean
  startDisabled?: boolean
  startLoading?: boolean
  onStart?: () => void

  // Reboot action
  showReboot?: boolean
  rebootDisabled?: boolean
  rebootLoading?: boolean
  onReboot?: () => void

  // Delete action
  showDelete?: boolean
  deleteDisabled?: boolean
  deleteLoading?: boolean
  onDelete?: () => void

  // Download action
  showDownload?: boolean
  downloadDisabled?: boolean
  downloadLoading?: boolean
  onDownload?: () => void

  // Go back action
  onBack: () => void
}
