import React, { memo, useRef } from 'react'
import { InstanceSSHKeysCellProps } from './types'
import { StyledPortal, SSHKeysButton, SSHKeyRow } from './styles'
import {
  ObjectImg,
  useClickOutside,
  useFloatPosition,
  useTransition,
  useWindowScroll,
  useWindowSize,
} from '@aleph-front/core'
import { Portal } from '@/components/common/Portal'
import { EntityType, EntityTypeObject } from '@/helpers/constants'

export const InstanceSSHKeysCell = ({
  sshKeys,
  onSSHKeyClick,
}: InstanceSSHKeysCellProps) => {
  const [showDropdown, setShowDropdown] = React.useState(false)

  const dropdownElementRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const windowSize = useWindowSize(0)
  const windowScroll = useWindowScroll(0)

  const { shouldMount, stage } = useTransition(showDropdown, 250)

  const isOpen = stage === 'enter'

  const {
    myRef: dropdownRef,
    atRef: triggerRef,
    position: dropdownPosition,
  } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: dropdownElementRef,
    atRef: buttonRef,
    deps: [windowSize, windowScroll, shouldMount],
  })

  useClickOutside(() => {
    if (showDropdown) setShowDropdown(false)
  }, [dropdownRef, triggerRef])

  const handleSSHKeyClick = (sshKey: (typeof sshKeys)[0]) => {
    if (!sshKey) return
    setShowDropdown(false)
    onSSHKeyClick(sshKey)
  }

  const validKeys = sshKeys.filter((key) => key !== undefined)

  if (validKeys.length === 0) {
    return (
      <SSHKeysButton disabled>
        <ObjectImg
          id={EntityTypeObject[EntityType.SSHKey]}
          color="base2"
          size="1.5rem"
        />
      </SSHKeysButton>
    )
  }

  return (
    <span onClick={(e) => e.stopPropagation()}>
      <SSHKeysButton
        ref={buttonRef}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <ObjectImg
          id={EntityTypeObject[EntityType.SSHKey]}
          color="base2"
          size="1.5rem"
        />
      </SSHKeysButton>
      <Portal>
        {showDropdown && (
          <StyledPortal
            $isOpen={isOpen}
            $position={dropdownPosition}
            ref={dropdownRef}
          >
            <div tw="flex flex-col w-full">
              {validKeys.map(
                (sshKey) =>
                  sshKey && (
                    <SSHKeyRow
                      key={sshKey.id}
                      onClick={() => handleSSHKeyClick(sshKey)}
                    >
                      <ObjectImg
                        id={EntityTypeObject[EntityType.SSHKey]}
                        color="base2"
                        size="1.5rem"
                      />
                      <div>
                        <div className="tp-info text-base2 fs-12">SSH KEY</div>
                        <div className="tp-body1 fs-12">
                          {sshKey.label || 'Unnamed key'}
                        </div>
                      </div>
                    </SSHKeyRow>
                  ),
              )}
            </div>
          </StyledPortal>
        )}
      </Portal>
    </span>
  )
}

InstanceSSHKeysCell.displayName = 'InstanceSSHKeysCell'

export default memo(InstanceSSHKeysCell) as typeof InstanceSSHKeysCell
