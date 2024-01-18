import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { PaymentMethod } from '@/helpers/constants'

export type UseNewInstancePageReturn = {
  selected: PaymentMethod
  handleClickHold: () => void
  handleClickStream: () => void
  handleContinue: () => void
}

export function useNewInstancePage(): UseNewInstancePageReturn {
  const [selected, setSelected] = useState<PaymentMethod>(PaymentMethod.Hold)
  const router = useRouter()

  const handleClickHold = useCallback(() => {
    setSelected(PaymentMethod.Hold)
  }, [])

  const handleClickStream = useCallback(() => {
    setSelected(PaymentMethod.Stream)
  }, [])

  const handleContinue = useCallback(() => {
    router.push(`./new/${selected}`)
  }, [router, selected])

  return {
    selected,
    handleClickHold,
    handleClickStream,
    handleContinue,
  }
}
