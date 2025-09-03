import { ReactNode, RefObject } from 'react'
import { FloatingFooterProps } from '../FloatingFooter/cmp'

export type CheckoutSummaryFooterProps = Pick<
  FloatingFooterProps,
  'shouldHide' | 'thresholdOffset' | 'deps'
> & {
  submitButton?: ReactNode
  mainRef?: RefObject<HTMLElement>
  totalCost?: number
}
