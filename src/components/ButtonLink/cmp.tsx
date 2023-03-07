import Link from 'next/link'
import { Button } from '@aleph-front/aleph-core'
import { ButtonLinkProps } from './types'

/** 
 * A wrapper for the nextjs links that are styled as buttons
 * https://stackoverflow.com/questions/49288987/styled-components-with-components-in-nextjs/49306326#49306326
*/
export default function ButtonLink({ href, children }: ButtonLinkProps) {
  return (
    <Link href={href} passHref>
      <Button as="a" href={href} variant="secondary" color="main0" kind="neon" size="regular">
        { children }
      </Button>
    </Link>
  )
}