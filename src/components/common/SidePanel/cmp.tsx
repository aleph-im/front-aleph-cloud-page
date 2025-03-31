import React, { memo } from 'react'
import { StyledBackdrop, StyledHeader, StyledSidePanel } from './styles'
import { SidePanelProps } from './types'
import { Button, Icon } from '@aleph-front/core'

export const SidePanel = ({
  children,
  title,
  isOpen,
  onClose,
}: SidePanelProps) => {
  return (
    <>
      <StyledBackdrop $isOpen={isOpen} onClick={onClose} />
      <StyledSidePanel $isOpen={isOpen}>
        {/* Side Panel Header */}
        <StyledHeader>
          {/* Desktop close button (right arrow) */}
          <Button
            variant="functional"
            onClick={onClose}
            tw="absolute top-6 left-6 hidden md:flex"
          >
            <Icon name="angle-right" size="lg" />
          </Button>

          {/* Mobile close button (down arrow) */}
          <Button
            variant="functional"
            onClick={onClose}
            tw="absolute top-6 right-6 md:hidden"
          >
            <Icon name="angle-down" size="lg" />
          </Button>

          <div
            tw="flex justify-center items-center text-center w-full px-4"
            className="tp-h5"
          >
            {title}
          </div>
        </StyledHeader>
        <div tw="p-12">{children}</div>
      </StyledSidePanel>
    </>
  )
}

SidePanel.displayName = 'SidePanel'

export default memo(SidePanel) as typeof SidePanel
