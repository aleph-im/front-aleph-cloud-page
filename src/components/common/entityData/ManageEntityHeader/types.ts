import {
  Executable,
  ExecutableCalculatedStatus,
  ExecutableStatus,
} from '@/domain/executable'
import { EntityType } from '@/helpers/constants'
import { LabelProps } from '@aleph-front/core'
import { DefaultTheme } from 'styled-components'

export type EntityStatusPropsV1 = {
  entity: ManageEntityHeaderProps['entity']
  isAllocated: ManageEntityHeaderProps['isAllocated']
  labelVariant: ManageEntityHeaderProps['labelVariant']
  theme: DefaultTheme
}

export type EntityStatusPropsV2 = {
  calculatedStatus: ManageEntityHeaderProps['calculatedStatus']
  theme: DefaultTheme
}

export type EntityStatusProps = EntityStatusPropsV1 &
  EntityStatusPropsV2 & { status: ManageEntityHeaderProps['status'] }

export type ManageEntityHeaderProps = {
  name: string
  labelVariant: LabelProps['variant']
  isAllocated: boolean
  entity?: Executable
  type: EntityType

  status?: ExecutableStatus
  calculatedStatus?: ExecutableCalculatedStatus

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
