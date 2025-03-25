import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { Button, ButtonProps, Icon } from '@aleph-front/core'
import ResponsiveTooltip from '../ResponsiveTooltip'

export type ButtonWithInfoTooltipProps = ButtonProps & {
  tooltipContent?: React.ReactNode
  tooltipPosition?: {
    my?: string
    at?: string
  }
}

/**
 * Extended Button component that shows an info icon with tooltip when disabled
 * This component automatically adds the info icon to disabled buttons
 * and shows the tooltip when hovering over the button or icon
 */
export const ButtonWithInfoTooltip = forwardRef<
  HTMLButtonElement,
  ButtonWithInfoTooltipProps
>(
  (
    { tooltipContent, tooltipPosition, children, disabled, ...buttonProps },
    ref,
  ) => {
    // Wait until after client-side hydration to show tooltip
    const [renderTooltip, setRenderTooltip] = useState(false)
    useEffect(() => {
      setRenderTooltip(true)
    }, [])

    // Create a ref if one wasn't provided
    const buttonRef = useRef<HTMLButtonElement>(null)
    const targetRef = (ref as React.RefObject<HTMLButtonElement>) || buttonRef

    return (
      <div className="inline-flex relative">
        <Button ref={targetRef} disabled={disabled} {...buttonProps}>
          <span className="flex items-center gap-2">
            {children}
            {disabled && tooltipContent && (
              <Icon name="info-circle" size="sm" style={{ opacity: 0.8 }} />
            )}
          </span>
        </Button>

        {renderTooltip && disabled && tooltipContent && (
          <ResponsiveTooltip
            my={tooltipPosition?.my || 'bottom-center'}
            at={tooltipPosition?.at || 'top-center'}
            targetRef={targetRef}
            content={tooltipContent}
          />
        )}
      </div>
    )
  },
)

ButtonWithInfoTooltip.displayName = 'ButtonWithInfoTooltip'

export default ButtonWithInfoTooltip
