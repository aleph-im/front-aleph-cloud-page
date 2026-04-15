import { UseFormReturn } from '@/hooks/common/useForm'
import { CreditTransferFormData } from '@/helpers/schemas/credit'
import { UseFieldArrayReturn } from 'react-hook-form'

export type UseCreditTransferModalReturn = {
  isOpen: boolean
  handleOpen: () => void
  handleClose: () => void
}

export type UseCreditTransferModalFormReturn = {
  control: UseFormReturn<CreditTransferFormData, string>['control']
  handleSubmit: UseFormReturn<CreditTransferFormData, string>['handleSubmit']
  errors: UseFormReturn<CreditTransferFormData, string>['formState']['errors']
  isSubmitLoading: boolean
  fieldArray: UseFieldArrayReturn<CreditTransferFormData, 'recipients'>
  balanceDollars: number
  handleFillMax: (index: number) => void
}
