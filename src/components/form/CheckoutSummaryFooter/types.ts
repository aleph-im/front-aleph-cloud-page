import { PaymentMethod } from '@/helpers/constants'
import { ReactNode, RefObject } from 'react'
import { FloatingFooterProps } from '../FloatingFooter/cmp'

export type CheckoutSummaryFooterProps = Pick<
  FloatingFooterProps,
  'shouldHide' | 'thresholdOffset' | 'deps'
> & {
  paymentMethod: PaymentMethod
  submitButton?: ReactNode
  paymentMethodSwitch?: ReactNode
  mainRef?: RefObject<HTMLElement>
  totalCost?: number
}
