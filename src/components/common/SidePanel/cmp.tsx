import React, { memo } from 'react'
import { StyledBackdrop, StyledSidePanel } from './styles'
import { SidePanelProps } from './types'
import { Button, Icon } from '@aleph-front/core'
import { Separator } from '@/components/pages/dashboard/common'

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
        <Button
          variant="functional"
          onClick={onClose}
          tw="absolute top-4 left-4"
        >
          <Icon name="angle-double-right" size="xl" />
        </Button>
        <div
          tw="flex justify-center items-center text-center w-full px-4"
          className="tp-h5"
        >
          {title}
        </div>
        <Separator />
        <div tw="p-4">{children}</div>
      </StyledSidePanel>
    </>
  )
}

SidePanel.displayName = 'SidePanel'

export default memo(SidePanel) as typeof SidePanel
