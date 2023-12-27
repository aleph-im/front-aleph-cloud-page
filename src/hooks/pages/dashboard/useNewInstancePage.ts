import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { PaymentMethod } from '@/helpers/constants'
import useConnectedWard from '@/hooks/common/useConnectedWard'

export type UseNewInstancePageReturn = {
  selected: PaymentMethod
  handleClickHOLD: () => void
  handleClickPAYG: () => void
  handleContinue: () => void
}

export function useNewInstancePage(): UseNewInstancePageReturn {
  useConnectedWard()

  const [selected, setSelected] = useState<PaymentMethod>(PaymentMethod.HOLD)
  const router = useRouter()

  const handleClickHOLD = useCallback(() => {
    setSelected(PaymentMethod.HOLD)
  }, [])

  const handleClickPAYG = useCallback(() => {
    setSelected(PaymentMethod.PAYG)
  }, [])

  const handleContinue = useCallback(() => {
    router.push(`./new/${selected}`)
  }, [router, selected])

  return {
    selected,
    handleClickHOLD,
    handleClickPAYG,
    handleContinue,
  }
}
