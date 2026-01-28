export type InstanceRowActionsProps = {
  onStop: () => void
  onStart: () => void
  onReboot: () => void
  onDelete: () => void
  onManage: () => void
  stopDisabled?: boolean
  startDisabled?: boolean
  rebootDisabled?: boolean
  deleteDisabled?: boolean
}
