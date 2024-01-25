import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'

export type UseNewInstancePageReturn = {
  selected: 'auto' | 'crn'
  handleClickAuto: () => void
  handleClickCRN: () => void
  handleContinue: () => void
}

export function useNewInstancePage(): UseNewInstancePageReturn {
  const [selected, setSelected] =
    useState<UseNewInstancePageReturn['selected']>('auto')
  const router = useRouter()

  const handleClickAuto = useCallback(() => {
    setSelected('auto')
  }, [])

  const handleClickCRN = useCallback(() => {
    setSelected('crn')
  }, [])

  const handleContinue = useCallback(() => {
    router.push(`./new/${selected}`)
  }, [router, selected])

  return {
    selected,
    handleClickAuto,
    handleClickCRN,
    handleContinue,
  }
}
