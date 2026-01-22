import { memo, useRef, useState, useCallback } from 'react'
import {
  Icon,
  useClickOutside,
  useFloatPosition,
  useTransition,
  useWindowScroll,
  useWindowSize,
} from '@aleph-front/core'
import Link from 'next/link'
import { Portal } from '@/components/common/Portal'
import { StyledMenuPortal, MenuTriggerButton, MenuItemButton } from './styles'
import { DetailsMenuButtonProps } from './types'

export const DetailsMenuButton = ({
  menuItems,
  icon,
  disabled = false,
}: DetailsMenuButtonProps) => {
  const [showMenu, setShowMenu] = useState(false)

  const menuElementRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const windowSize = useWindowSize(0)
  const windowScroll = useWindowScroll(0)

  const { shouldMount, stage } = useTransition(showMenu, 250)

  const isOpen = stage === 'enter'

  const {
    myRef: menuRef,
    atRef: triggerRef,
    position: menuPosition,
  } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: menuElementRef,
    atRef: menuButtonRef,
    deps: [windowSize, windowScroll, shouldMount],
  })

  useClickOutside(() => {
    if (showMenu) setShowMenu(false)
  }, [menuRef, triggerRef])

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!disabled) {
        setShowMenu(!showMenu)
      }
    },
    [disabled, showMenu],
  )

  const handleClose = useCallback(() => setShowMenu(false), [])

  const handleItemClick = useCallback(
    (onClick?: () => void) => {
      handleClose()
      onClick?.()
    },
    [handleClose],
  )

  return (
    <span onClick={(e) => e.stopPropagation()}>
      <MenuTriggerButton
        ref={menuButtonRef}
        onClick={handleToggle}
        disabled={disabled}
      >
        {icon || <Icon name="ellipsis" />}
      </MenuTriggerButton>
      <Portal>
        {shouldMount && (
          <StyledMenuPortal
            $isOpen={isOpen}
            $position={menuPosition}
            ref={menuRef}
          >
            <div tw="flex flex-col items-start w-full">
              {menuItems.map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    tw="px-4 py-3 w-full text-left"
                    onClick={handleClose}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <MenuItemButton
                    key={item.label}
                    disabled={item.disabled}
                    tw="px-4 py-3 w-full text-left"
                    onClick={() => handleItemClick(item.onClick)}
                  >
                    {item.label}
                  </MenuItemButton>
                ),
              )}
            </div>
          </StyledMenuPortal>
        )}
      </Portal>
    </span>
  )
}

DetailsMenuButton.displayName = 'DetailsMenuButton'

export default memo(DetailsMenuButton) as typeof DetailsMenuButton
