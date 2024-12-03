import { CoreTheme } from '@aleph-front/core'

export type ExternalLinkProps = {
  href: string
  text?: string
  color?: keyof CoreTheme['color']
  typo?: keyof CoreTheme['typo']
  underline?: boolean
}
