import { TooltipProps } from '@aleph-front/core'
import { InsufficientFundsInfo } from '@/hooks/common/useInsufficientFunds'
import { FormEvent } from 'react'

export type CheckoutButtonProps = {
  disabled: boolean
  title: string
  tooltipContent?: TooltipProps['content']
  isFooter: boolean
  shouldRequestTermsAndConditions?: boolean
  handleRequestTermsAndConditionsAgreement?: () => void
  handleSubmit: (e: FormEvent) => Promise<void>
  insufficientFunds?: InsufficientFundsInfo
}
