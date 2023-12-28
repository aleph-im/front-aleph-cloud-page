import { ButtonProps } from '@aleph-front/aleph-core'
import { ReactElement } from 'react'

export type ButtonLinkProps = ButtonProps & {
  href: string
  children: ReactElement | string
}
