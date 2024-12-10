import { CoreTheme } from '@aleph-front/core'
import { AnchorHTMLAttributes } from 'react'

export type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string
  text?: string
  color?: keyof CoreTheme['color']
  typo?: keyof CoreTheme['typo']
  underline?: boolean
}
