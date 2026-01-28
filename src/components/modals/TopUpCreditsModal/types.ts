import { FormEvent } from 'react'
import { Control, FieldErrors, UseControllerReturn } from 'react-hook-form'
import { TopUpCreditsFormData } from '@/helpers/schemas/credit'

export type UseTopUpCreditsModalReturn = {
  isOpen: boolean
  handleOpen: (minimumBalance?: number) => void
  handleClose: () => void
}

export type UseTopUpCreditsModalFormProps = {
  onSuccess?: (txHash: string) => void
  refetchPaymentHistory?: () => void
}

export type UseTopUpCreditsModalFormReturn = {
  values: TopUpCreditsFormData
  control: Control<TopUpCreditsFormData>
  amountCtrl: UseControllerReturn<TopUpCreditsFormData, 'amount'>
  currencyCtrl: UseControllerReturn<TopUpCreditsFormData, 'currency'>
  errors: FieldErrors<TopUpCreditsFormData>
  handleSubmit: (e: FormEvent) => Promise<void>
  handleAmountChange: (value: number) => void
  bonus: number
  totalBalance: number
  isLoadingEstimation: boolean
  isSubmitLoading: boolean
  isCalculatingInitialAmount: boolean
  minimumCreditsNeeded?: number
  showInsufficientWarning: boolean
  isSubmitDisabled: boolean
}
