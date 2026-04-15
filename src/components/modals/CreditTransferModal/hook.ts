import { useCallback, useMemo } from 'react'
import { useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppState } from '@/contexts/appState'
import {
  openCreditTransferModal,
  closeCreditTransferModal,
  openTransferStatusModal,
} from '@/store/ui'
import { useForm } from '@/hooks/common/useForm'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { useCreditTransfer } from '@/hooks/common/useCreditTransfer'
import { useConnection } from '@/hooks/common/useConnection'
import { CREDITS_PER_USD } from '@/domain/credit'
import {
  CreditTransferFormData,
  creditTransferSchema,
} from '@/helpers/schemas/credit'
import {
  UseCreditTransferModalReturn,
  UseCreditTransferModalFormReturn,
} from './types'

const defaultValues = {
  recipients: [
    { address: '', amount: '' as unknown as number, expiration: '' },
  ],
} as CreditTransferFormData

export function useCreditTransferModal(): UseCreditTransferModalReturn {
  const [state, dispatch] = useAppState()

  const isOpen = state.ui.isCreditTransferModalOpen

  const handleOpen = useCallback(() => {
    dispatch(openCreditTransferModal())
  }, [dispatch])

  const handleClose = useCallback(() => {
    dispatch(closeCreditTransferModal())
  }, [dispatch])

  return { isOpen, handleOpen, handleClose }
}

export function useCreditTransferModalForm(): UseCreditTransferModalFormReturn {
  const [, dispatch] = useAppState()
  const { transfer } = useCreditTransfer()
  const { creditBalance } = useConnection({ triggerOnMount: false })
  const { handleClose } = useCreditTransferModal()
  const { next, stop } = useCheckoutNotification({})

  const balanceDollars = useMemo(
    () => (creditBalance ? creditBalance / CREDITS_PER_USD : 0),
    [creditBalance],
  )

  const onSubmit = useCallback(
    async (data: CreditTransferFormData) => {
      const nSteps = [stepsCatalog['creditTransfer']]

      // Convert $ amounts to credits
      const recipients = data.recipients.map((r) => ({
        address: r.address,
        amount: Math.round(r.amount * CREDITS_PER_USD),
        ...(r.expiration && {
          expiration: new Date(r.expiration).getTime(),
        }),
      }))

      try {
        await next(nSteps)
        const itemHash = await transfer(recipients)

        handleClose()
        dispatch(openTransferStatusModal(itemHash))

        return itemHash
      } finally {
        await stop()
      }
    },
    [transfer, handleClose, dispatch, next, stop],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    requestState: { loading: isSubmitLoading },
  } = useForm({
    defaultValues,
    onSubmit,
    onSuccess: async () => undefined,
    resolver: zodResolver(creditTransferSchema),
  })

  const fieldArray = useFieldArray({
    control,
    name: 'recipients',
  })

  const handleFillMax = useCallback(
    (index: number) => {
      const currentRecipients = getValues('recipients')
      const othersTotal = currentRecipients.reduce(
        (sum, r, i) => (i === index ? sum : sum + (Number(r.amount) || 0)),
        0,
      )
      // Floor to 6 decimals to ensure integer credits after * CREDITS_PER_USD
      const maxForThis =
        Math.floor(
          Math.max(0, balanceDollars - othersTotal) * CREDITS_PER_USD,
        ) / CREDITS_PER_USD

      setValue(`recipients.${index}.amount`, maxForThis, {
        shouldValidate: true,
      })
    },
    [balanceDollars, getValues, setValue],
  )

  return {
    control,
    handleSubmit,
    errors,
    isSubmitLoading,
    fieldArray,
    balanceDollars,
    handleFillMax,
  }
}
