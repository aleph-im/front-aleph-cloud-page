import React, { memo } from 'react'
import { Instance } from '@/domain/instance'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useInstanceRowActions } from './useInstanceRowActions'
import InstanceRowActions from './cmp'
import { ExecutableStatus } from '@/domain/executable'

export type InstanceRowActionsContainerProps = {
  instance: Instance
  status?: ExecutableStatus
  statusLoading?: boolean
  onManage: () => void
}

export const InstanceRowActionsContainer = ({
  instance,
  status,
  statusLoading,
  onManage,
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
  })

  return (
    <InstanceRowActions
      onStop={handleStop}
      onStart={handleStart}
      onReboot={handleReboot}
      onDelete={handleDelete}
      onManage={onManage}
      stopDisabled={stopDisabled}
      startDisabled={startDisabled}
      rebootDisabled={rebootDisabled}
      deleteDisabled={deleteDisabled}
    />
  )
}

InstanceRowActionsContainer.displayName = 'InstanceRowActionsContainer'

export default memo(InstanceRowActionsContainer)
