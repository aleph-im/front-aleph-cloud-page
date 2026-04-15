import { useCallback } from 'react'
import { useAppState } from '@/contexts/appState'
import {
  openCreditTransferModal,
  closeCreditTransferModal,
  openTransferStatusModal,
} from '@/store/ui'
import { useCreditTransfer } from '@/hooks/common/useCreditTransfer'
import { UseCreditTransferModalReturn, CreditTransferFormData } from './types'

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

export function useCreditTransferForm() {
  const [, dispatch] = useAppState()
  const { transfer, loading, error } = useCreditTransfer()
  const { handleClose } = useCreditTransferModal()

  const handleSubmit = useCallback(
    async (data: CreditTransferFormData) => {
      const recipients = data.recipients.map((r) => ({
        address: r.address,
        amount: r.amount,
        ...(r.expiration && {
          expiration: new Date(r.expiration).getTime(),
        }),
      }))

      const itemHash = await transfer(recipients)

      handleClose()
      dispatch(openTransferStatusModal(itemHash))
    },
    [transfer, handleClose, dispatch],
  )

  return {
    handleSubmit,
    loading,
    error,
  }
}
