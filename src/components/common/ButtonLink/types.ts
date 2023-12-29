import { ButtonProps } from '@aleph-front/aleph-core'
import { ReactElement } from 'react'

export type ButtonLinkProps = Omit<
  ButtonProps,
  'variant' | 'color' | 'kind' | 'size'
> & {
  href: string
  children: ReactElement | string
} & Partial<Pick<ButtonProps, 'variant' | 'color' | 'kind' | 'size'>>
