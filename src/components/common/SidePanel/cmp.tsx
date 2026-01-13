import React, { memo, useCallback, MouseEvent } from 'react'
import {
  StyledBackdrop,
  StyledContent,
  StyledFooter,
  StyledHeader,
  StyledSidePanel,
} from './styles'
import { SidePanelProps } from './types'
import { useTransition } from '@aleph-front/core'
import { useTheme } from 'styled-components'
import { Portal } from '../Portal'

export const SidePanel = ({
  children,
  title,
  isOpen,
  onClose,
  footer,
  order = 0,
  width,
  mobileHeight,
}: SidePanelProps) => {
  const theme = useTheme()

  const handlePanelClick = useCallback((e: MouseEvent) => {
    e.stopPropagation()
  }, [])

  const { shouldMount, stage: $stage } = useTransition(
    isOpen,
    theme.transition.duration.normal,
  )

  const open = $stage === 'enter'

  return (
    <>
      <Portal>
        {shouldMount && (
          <StyledBackdrop $isOpen={open} $order={order} onClick={onClose}>
            <StyledSidePanel
              $isOpen={open}
              $order={order}
              $width={width}
              $mobileHeight={mobileHeight}
              onClick={handlePanelClick}
            >
              {/* Side Panel Header */}
              <StyledHeader>
                <div
                  tw="flex justify-start items-center w-full px-12"
                  className="tp-h5"
                >
                  {title}
                </div>
              </StyledHeader>
              <StyledContent>
                {children}
                {footer && <div tw="h-[5.375rem]" />}
              </StyledContent>
              {footer && (
                <>
                  <StyledFooter $isOpen={open}>{footer}</StyledFooter>
                </>
              )}
            </StyledSidePanel>
          </StyledBackdrop>
        )}
      </Portal>
    </>
  )
}

SidePanel.displayName = 'SidePanel'

export default memo(SidePanel) as typeof SidePanel
