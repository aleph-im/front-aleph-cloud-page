import { IconSize, TooltipProps } from '@aleph-front/core'
import { ReactNode } from 'react'

export type InfoTooltipButtonProps = Omit<TooltipProps, 'targetRef'> & {
  children?: ReactNode
  tooltipContent: ReactNode
  plain?: boolean
  align?: 'left' | 'right'
  vAlign?: 'top' | 'center' | 'bottom'
  iconSize?: IconSize
}
