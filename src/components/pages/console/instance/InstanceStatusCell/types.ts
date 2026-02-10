import { ExecutableCalculatedStatus } from '@/domain/executable'

export type InstanceStatusCellVariant = 'badge' | 'icon'

export type InstanceStatusCellProps = {
  calculatedStatus: ExecutableCalculatedStatus
  variant?: InstanceStatusCellVariant
}
