import { ButtonProps } from '@aleph-front/core'
import { AnchorHTMLAttributes, ReactElement } from 'react'

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  Omit<ButtonProps, 'variant' | 'color' | 'kind' | 'size'> &
  Partial<Pick<ButtonProps, 'variant' | 'color' | 'kind' | 'size'>> & {
    href: string
    children: ReactElement | string
  }
