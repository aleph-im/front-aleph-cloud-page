import { FormEvent } from 'react'
import { Control, FieldErrors, UseControllerReturn } from 'react-hook-form'
import { TopUpCreditsFormData } from '@/helpers/schemas/credit'

export type UseTopUpCreditsModalReturn = {
  values: TopUpCreditsFormData
  control: Control<TopUpCreditsFormData>
  amountCtrl: UseControllerReturn<TopUpCreditsFormData, 'amount'>
  currencyCtrl: UseControllerReturn<TopUpCreditsFormData, 'currency'>
  errors: FieldErrors<TopUpCreditsFormData>
  handleSubmit: (e: FormEvent) => Promise<void>
  resetForm: () => void
  bonus: number
  totalBalance: number
}
