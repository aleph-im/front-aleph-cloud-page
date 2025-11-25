import React, { memo, useRef } from 'react'
import { PermissionsRowActionsProps } from './types'
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

export const PermissionsRowActions = ({
  onConfigure,
  onRevoke,
}: PermissionsRowActionsProps) => {
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

  const handleConfigure = () => {
    setShowActions(false)
    onConfigure()
  }

  const handleRevoke = () => {
    setShowActions(false)
    onRevoke()
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
            <div tw="flex flex-col items-start w-full">
              <ActionButton
                tw="px-4 py-3 w-full text-left"
                onClick={handleConfigure}
              >
                Configure
              </ActionButton>
              <ActionButton
                tw="px-4 py-3 w-full text-left"
                onClick={handleRevoke}
              >
                Revoke
              </ActionButton>
            </div>
          </StyledPortal>
        )}
      </Portal>
    </span>
  )
}

PermissionsRowActions.displayName = 'PermissionsRowActions'

export default memo(PermissionsRowActions) as typeof PermissionsRowActions
