import { ReactNode } from 'react'

export type CheckoutNotificationStepProps = {
  isActive: boolean
  step: number
  total: number
  title: ReactNode
  content: ReactNode
}

export type CheckoutNotificationStep = Omit<
  CheckoutNotificationStepProps,
  'step' | 'total' | 'isActive'
>

export type CheckoutNotificationProps = {
  steps: CheckoutNotificationStep[]
  activeStep: number
}
