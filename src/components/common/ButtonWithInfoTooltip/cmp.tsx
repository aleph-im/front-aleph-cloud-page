import React, { forwardRef, useEffect, useRef, useState, useMemo } from 'react'
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
    {
      tooltipContent,
      tooltipPosition,
      children,
      disabled,
      size,
      ...buttonProps
    },
    ref,
  ) => {
    // Wait until after client-side hydration to show tooltip
    const [renderTooltip, setRenderTooltip] = useState(false)
    useEffect(() => {
      setRenderTooltip(true)
    }, [])

    // Determine icon size based on button size
    const iconSize = useMemo(() => {
      switch (size) {
        case 'xs':
          return 'xs'
        case 'sm':
          return 'sm'
        case 'md':
          return 'md'
        case 'lg':
          return 'md' // Slightly larger relative to button
        case 'xl':
          return 'lg'
        default:
          return 'md'
      }
    }, [size])

    // Create a ref if one wasn't provided
    const buttonRef = useRef<HTMLButtonElement>(null)
    const targetRef = (ref as React.RefObject<HTMLButtonElement>) || buttonRef

    return (
      <div className="inline-flex relative">
        <Button
          ref={targetRef}
          disabled={disabled}
          size={size}
          {...buttonProps}
        >
          <span className="flex items-center gap-3">
            {children}
            {disabled && tooltipContent && (
              <Icon
                name="info-circle"
                size={iconSize}
                style={{ opacity: 0.8 }}
              />
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
