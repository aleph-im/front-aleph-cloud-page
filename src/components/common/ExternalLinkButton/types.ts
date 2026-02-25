import { ButtonProps } from '@aleph-front/core'
import { ReactNode } from 'react'

export type ExternalLinkButtonProps = Omit<
  ButtonProps,
  'size' | 'kind' | 'variant' | 'color'
> & {
  href: string
  children?: ReactNode
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
}
