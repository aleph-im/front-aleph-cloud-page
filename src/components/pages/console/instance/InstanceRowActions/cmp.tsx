import React, { memo, useRef } from 'react'
import { InstanceRowActionsProps } from './types'
import {
  StyledPortal,
  RowActionsButton,
  ActionsRow,
  ActionIconButton,
  ManageButton,
} from './styles'
import {
  Icon,
  useClickOutside,
  useFloatPosition,
  useTransition,
  useWindowScroll,
  useWindowSize,
} from '@aleph-front/core'
import { Portal } from '@/components/common/Portal'

export const InstanceRowActions = ({
  onStop,
  onStart,
  onReboot,
  onDelete,
  onManage,
  stopDisabled,
  startDisabled,
  rebootDisabled,
  deleteDisabled,
}: InstanceRowActionsProps) => {
  const [showActions, setShowActions] = React.useState(false)

  const actionsElementRef = useRef<HTMLDivElement>(null)
  const actionsButtonRef = useRef<HTMLButtonElement>(null)

  const windowSize = useWindowSize(0)
  const windowScroll = useWindowScroll(0)

  const { shouldMount, stage } = useTransition(showActions, 250)

  const isOpen = stage === 'enter'

  const {
    myRef: actionsRef,
    atRef: triggerRef,
    position: actionsPosition,
  } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: actionsElementRef,
    atRef: actionsButtonRef,
    deps: [windowSize, windowScroll, shouldMount],
  })

  useClickOutside(() => {
    if (showActions) setShowActions(false)
  }, [actionsRef, triggerRef])

  const handleAction = (action: () => void) => {
    setShowActions(false)
    action()
  }

  return (
    <span onClick={(e) => e.stopPropagation()}>
      <RowActionsButton
        ref={actionsButtonRef}
        onClick={() => setShowActions(!showActions)}
      >
        <Icon name="ellipsis" />
      </RowActionsButton>
      <Portal>
        {showActions && (
          <StyledPortal
            $isOpen={isOpen}
            $position={actionsPosition}
            ref={actionsRef}
          >
            <div tw="flex flex-col w-full">
              <ManageButton onClick={() => handleAction(onManage)}>
                Manage
              </ManageButton>
              <ActionsRow>
                <ActionIconButton
                  onClick={() => handleAction(onStop)}
                  disabled={stopDisabled}
                  title="Stop"
                >
                  <Icon name="stop" size="sm" />
                </ActionIconButton>
                <ActionIconButton
                  onClick={() => handleAction(onStart)}
                  disabled={startDisabled}
                  title="Start"
                >
                  <Icon name="play" size="sm" />
                </ActionIconButton>
                <ActionIconButton
                  onClick={() => handleAction(onReboot)}
                  disabled={rebootDisabled}
                  title="Reboot"
                >
                  <Icon name="arrow-rotate-backward" size="sm" />
                </ActionIconButton>
                <ActionIconButton
                  onClick={() => handleAction(onDelete)}
                  disabled={deleteDisabled}
                  $variant="error"
                  title="Delete"
                >
                  <Icon name="trash" size="sm" />
                </ActionIconButton>
              </ActionsRow>
            </div>
          </StyledPortal>
        )}
      </Portal>
    </span>
  )
}

InstanceRowActions.displayName = 'InstanceRowActions'

export default memo(InstanceRowActions) as typeof InstanceRowActions
