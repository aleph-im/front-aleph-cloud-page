import { memo, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@aleph-front/core'
import { ButtonLinkProps } from './types'
import ResponsiveTooltip from '../ResponsiveTooltip'

/**
 * A wrapper for the nextjs links that are styled as buttons
 * https://stackoverflow.com/questions/49288987/styled-components-with-components-in-nextjs/49306326#49306326
 */
export const ButtonLink = ({
  href,
  variant = 'secondary',
  color = 'main0',
  kind = 'default',
  size = 'md',
  disabled,
  disabledMessage,
  tooltipPosition,
  children,
  ...rest
}: ButtonLinkProps) => {
  const targetRef = useRef<HTMLButtonElement>(null)

  // Wait until after client-side hydration to show tooltip
  const [renderTooltip, setRenderTooltip] = useState(false)
  useEffect(() => {
    setRenderTooltip(true)
  }, [])

  const buttonNode = (
    <Button
      {...{
        as: disabled ? undefined : 'a',
        variant,
        color,
        kind,
        size,
        disabled,
        ref: targetRef,
        ...rest,
      }}
    >
      {children}
    </Button>
  )

  return !disabled ? (
    <Link href={href} passHref legacyBehavior>
      {buttonNode}
    </Link>
  ) : (
    <span>
      {buttonNode}
      {renderTooltip && disabledMessage && (
        <ResponsiveTooltip
          my={tooltipPosition?.my || 'bottom-center'}
          at={tooltipPosition?.at || 'top-right'}
          targetRef={targetRef}
          content={disabledMessage}
        />
      )}
    </span>
  )
}
ButtonLink.displayName = 'ButtonLink'

export default memo(ButtonLink) as typeof ButtonLink
