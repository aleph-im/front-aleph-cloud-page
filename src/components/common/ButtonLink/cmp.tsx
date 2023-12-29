import { memo } from 'react'
import Link from 'next/link'
import { Button } from '@aleph-front/aleph-core'
import { ButtonLinkProps } from './types'

/**
 * A wrapper for the nextjs links that are styled as buttons
 * https://stackoverflow.com/questions/49288987/styled-components-with-components-in-nextjs/49306326#49306326
 */
export const ButtonLink = ({
  href,
  variant = 'secondary',
  color = 'main0',
  kind = 'neon',
  size = 'regular',
  children,
  ...rest
}: ButtonLinkProps) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <Button
        {...{
          as: 'a',
          variant,
          color,
          kind,
          size,
          ...rest,
        }}
      >
        {children}
      </Button>
    </Link>
  )
}
ButtonLink.displayName = 'ButtonLink'

export default memo(ButtonLink) as typeof ButtonLink
