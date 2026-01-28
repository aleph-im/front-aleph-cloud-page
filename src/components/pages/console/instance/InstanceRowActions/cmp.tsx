import React, { memo, useRef } from 'react'
import { InstanceRowActionsProps } from './types'
import { StyledPortal, RowActionsButton, ActionButton } from './styles'
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
  onManage,
  onDelete,
  disabled = false,
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

  const handleManage = () => {
    setShowActions(false)
    onManage()
  }

  const handleDelete = () => {
    setShowActions(false)
    onDelete()
  }

  return (
    <span onClick={(e) => e.stopPropagation()}>
      <RowActionsButton
        ref={actionsButtonRef}
        onClick={() => !disabled && setShowActions(!showActions)}
        disabled={disabled}
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
            <div tw="flex flex-col items-start w-full">
              <ActionButton
                tw="px-4 py-3 w-full text-left"
                onClick={handleManage}
              >
                Manage
              </ActionButton>
              <ActionButton
                tw="px-4 py-3 w-full text-left"
                className="text-error"
                onClick={handleDelete}
              >
                Delete
              </ActionButton>
            </div>
          </StyledPortal>
        )}
      </Portal>
    </span>
  )
}

InstanceRowActions.displayName = 'InstanceRowActions'

export default memo(InstanceRowActions) as typeof InstanceRowActions
