import { useCallback } from 'react'
import { useAppState } from '@/contexts/appState'
import { openTopUpCreditsModal, closeTopUpCreditsModal } from '@/store/ui'

export function useTopUpCreditsModal() {
  const [state, dispatch] = useAppState()

  const isOpen = state.ui.isTopUpCreditsModalOpen

  const open = useCallback(() => {
    dispatch(openTopUpCreditsModal())
  }, [dispatch])

  const close = useCallback(() => {
    dispatch(closeTopUpCreditsModal())
  }, [dispatch])

  return {
    isOpen,
    open,
    close,
  }
}
