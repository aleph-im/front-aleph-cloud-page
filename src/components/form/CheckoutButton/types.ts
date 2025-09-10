import { TooltipProps } from '@aleph-front/core'
import { FormEvent } from 'react'

export type CheckoutButtonProps = {
  disabled: boolean
  title: string
  tooltipContent?: TooltipProps['content']
  isFooter: boolean
  shouldRequestTermsAndConditions?: boolean
  handleRequestTermsAndConditionsAgreement?: () => void
  handleSubmit: (e: FormEvent) => Promise<void>
}
