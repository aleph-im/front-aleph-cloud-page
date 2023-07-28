import { TooltipProps } from '@aleph-front/aleph-core'
import { ReactNode } from 'react'

export type InfoTooltipButtonProps = Omit<TooltipProps, 'targetRef'> & {
  children: ReactNode
  tooltipContent: ReactNode
  plain?: boolean
  align?: 'left' | 'right'
}
