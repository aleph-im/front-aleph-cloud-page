import React, { memo } from 'react'
import {
  StyledBackdrop,
  StyledContent,
  StyledFooter,
  StyledHeader,
  StyledSidePanel,
} from './styles'
import { SidePanelProps } from './types'

export const SidePanel = ({
  children,
  title,
  isOpen,
  onClose,
  footer,
}: SidePanelProps) => {
  return (
    <>
      <StyledBackdrop $isOpen={isOpen} onClick={onClose} />
      <StyledSidePanel $isOpen={isOpen}>
        {/* Side Panel Header */}
        <StyledHeader>
          <div
            tw="flex justify-start items-center w-full px-12"
            className="tp-h5"
          >
            {title}
          </div>
        </StyledHeader>
        <StyledContent>{children}</StyledContent>
        {footer && <StyledFooter>{footer}</StyledFooter>}
      </StyledSidePanel>
    </>
  )
}

SidePanel.displayName = 'SidePanel'

export default memo(SidePanel) as typeof SidePanel
