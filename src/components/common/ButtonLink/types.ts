import { ButtonProps, TooltipProps } from '@aleph-front/core'
import { AnchorHTMLAttributes, ReactNode } from 'react'

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  Omit<ButtonProps, 'variant' | 'color' | 'kind' | 'size'> &
  Partial<Pick<ButtonProps, 'variant' | 'color' | 'kind' | 'size'>> & {
    href: string
    children: ReactNode
  } & {
    disabledMessage?: ReactNode
    tooltipPosition?: Pick<TooltipProps, 'my' | 'at'>
  }
