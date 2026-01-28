import React, { memo } from 'react'
import { InstanceRowActionsProps } from './types'
import { ActionsContainer, ActionIconButton } from './styles'
import { Icon } from '@aleph-front/core'

export const InstanceRowActions = ({
  onStop,
  onStart,
  onReboot,
  onDelete,
  stopDisabled,
  startDisabled,
  rebootDisabled,
  deleteDisabled,
}: InstanceRowActionsProps) => {
  return (
    <span onClick={(e) => e.stopPropagation()}>
      <ActionsContainer>
        <ActionIconButton onClick={onStop} disabled={stopDisabled} title="Stop">
          <Icon name="stop" size="sm" />
        </ActionIconButton>
        <ActionIconButton
          onClick={onStart}
          disabled={startDisabled}
          title="Start"
        >
          <Icon name="play" size="sm" />
        </ActionIconButton>
        <ActionIconButton
          onClick={onReboot}
          disabled={rebootDisabled}
          title="Reboot"
        >
          <Icon name="arrow-rotate-backward" size="sm" />
        </ActionIconButton>
        <ActionIconButton
          onClick={onDelete}
          disabled={deleteDisabled}
          $variant="error"
          title="Delete"
        >
          <Icon name="trash" size="sm" />
        </ActionIconButton>
      </ActionsContainer>
    </span>
  )
}

InstanceRowActions.displayName = 'InstanceRowActions'

export default memo(InstanceRowActions) as typeof InstanceRowActions
