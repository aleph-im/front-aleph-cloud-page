import Link from 'next/link'
import { Button, ButtonProps } from '@aleph-front/aleph-core'
import { ButtonLinkProps } from './types'

/**
 * A wrapper for the nextjs links that are styled as buttons
 * https://stackoverflow.com/questions/49288987/styled-components-with-components-in-nextjs/49306326#49306326
 */
export default function ButtonLink({
  href,
  variant,
  color,
  kind,
  size,
  children,
  ...rest
}: ButtonLinkProps &
  Partial<Pick<ButtonProps, 'variant' | 'color' | 'kind' | 'size'>>) {
  return (
    <Link href={href} passHref legacyBehavior>
      <Button
        {...{
          as: 'a',
          variant: variant || 'secondary',
          color: color || 'main0',
          kind: kind || 'neon',
          size: size || 'regular',
          ...rest,
        }}
      >
        {children}
      </Button>
    </Link>
  )
}
