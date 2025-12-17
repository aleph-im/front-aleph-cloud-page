import { memo, useEffect } from 'react'
import { useModal } from '@aleph-front/core'
import { useTopUpCreditsModal } from '@/hooks/common/useTopUpCreditsModal'
import TopUpCreditsModalContent from '@/components/modals/TopUpCreditsModal/cmp'

export const GlobalTopUpCreditsModal = () => {
  const modal = useModal()
  const { isOpen, close } = useTopUpCreditsModal()

  useEffect(() => {
    if (isOpen) {
      modal?.open({
        width: '34rem',
        onClose: () => {
          close()
          modal?.close()
        },
        content: <TopUpCreditsModalContent onClose={close} />,
      })
    } else {
      modal?.close()
    }
  }, [isOpen, modal, close])

  return null
}

GlobalTopUpCreditsModal.displayName = 'GlobalTopUpCreditsModal'

export default memo(GlobalTopUpCreditsModal)
