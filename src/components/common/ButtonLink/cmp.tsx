import { memo } from 'react'
import Link from 'next/link'
import { Button } from '@aleph-front/core'
import { ButtonLinkProps } from './types'

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
  children,
  ...rest
}: ButtonLinkProps) => {
  const buttonNode = (
    <Button
      {...{
        as: disabled ? undefined : 'a',
        variant,
        color,
        kind,
        size,
        disabled,
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
    buttonNode
  )
}
ButtonLink.displayName = 'ButtonLink'

export default memo(ButtonLink) as typeof ButtonLink
