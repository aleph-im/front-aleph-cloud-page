import React, { memo, useRef } from 'react'
import { InstanceDomainsCellProps } from './types'
import { StyledPortal, DomainsButton, DomainRow } from './styles'
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

export const InstanceDomainsCell = ({
  domains,
  onDomainClick,
}: InstanceDomainsCellProps) => {
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

  const handleDomainClick = (domain: (typeof domains)[0]) => {
    setShowDropdown(false)
    onDomainClick(domain)
  }

  if (domains.length === 0) {
    return (
      <DomainsButton disabled>
        <ObjectImg
          id={EntityTypeObject[EntityType.Domain]}
          color="base2"
          size="1.5rem"
        />
      </DomainsButton>
    )
  }

  return (
    <span onClick={(e) => e.stopPropagation()}>
      <DomainsButton
        ref={buttonRef}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <ObjectImg
          id={EntityTypeObject[EntityType.Domain]}
          color="base2"
          size="1.5rem"
        />
      </DomainsButton>
      <Portal>
        {showDropdown && (
          <StyledPortal
            $isOpen={isOpen}
            $position={dropdownPosition}
            ref={dropdownRef}
          >
            <div tw="flex flex-col w-full">
              {domains.map((domain) => (
                <DomainRow
                  key={domain.id}
                  onClick={() => handleDomainClick(domain)}
                >
                  <ObjectImg
                    id={EntityTypeObject[EntityType.Domain]}
                    color="base2"
                    size="1.5rem"
                  />
                  <div>
                    <div className="tp-info text-base2 fs-12">DOMAIN</div>
                    <div className="tp-body1 fs-12">{domain.name}</div>
                  </div>
                </DomainRow>
              ))}
            </div>
          </StyledPortal>
        )}
      </Portal>
    </span>
  )
}

InstanceDomainsCell.displayName = 'InstanceDomainsCell'

export default memo(InstanceDomainsCell) as typeof InstanceDomainsCell
