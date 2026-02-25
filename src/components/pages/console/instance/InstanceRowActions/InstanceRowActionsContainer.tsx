import React, { memo } from 'react'
import { Instance } from '@/domain/instance'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useInstanceRowActions } from './useInstanceRowActions'
import InstanceRowActions from './cmp'
import { ExecutableStatus } from '@/domain/executable'
import { BoostPollingOptions } from '@/hooks/common/useRequestEntity/useRequestExecutableStatus'

export type InstanceRowActionsContainerProps = {
  instance: Instance
  status?: ExecutableStatus
  statusLoading?: boolean
  onManage: () => void
  disabled?: boolean
  triggerBoostPolling?: (options: BoostPollingOptions) => void
}

export const InstanceRowActionsContainer = ({
  instance,
  status,
  statusLoading,
  onManage,
  disabled = false,
  triggerBoostPolling,
}: InstanceRowActionsContainerProps) => {
  const manager = useInstanceManager()

  const {
    handleStop,
    handleStart,
    handleReboot,
    handleDelete,
    stopDisabled,
    startDisabled,
    rebootDisabled,
    deleteDisabled,
  } = useInstanceRowActions({
    instance,
    manager,
    status,
    statusLoading,
    triggerBoostPolling,
  })

  return (
    <InstanceRowActions
      onStop={handleStop}
      onStart={handleStart}
      onReboot={handleReboot}
      onDelete={handleDelete}
      onManage={onManage}
      stopDisabled={disabled || stopDisabled}
      startDisabled={disabled || startDisabled}
      rebootDisabled={disabled || rebootDisabled}
      deleteDisabled={disabled || deleteDisabled}
      disabled={disabled}
    />
  )
}

InstanceRowActionsContainer.displayName = 'InstanceRowActionsContainer'

export default memo(InstanceRowActionsContainer)
