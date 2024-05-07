import { useCallback } from 'react'
import { useAppState } from '@/contexts/appState'
import { mbPerAleph } from '@/helpers/constants'
import { useLocalRequest } from '@aleph-front/core'
import { useFileManager } from './useManager/useFileManager'

export type UseUserStoreAllowanceReturn = {
  consumedSize?: number
  allowedSize?: number
}

export function useUserStoreAllowance(): UseUserStoreAllowanceReturn {
  const [state] = useAppState()
  const { accountBalance = 0 } = state

  const manager = useFileManager()

  // -----------------------------

  const doRequest = useCallback(() => manager?.getFiles(), [manager])

  const { data: fileInfo } = useLocalRequest({
    doRequest,
    onSuccess: () => null,
    triggerOnMount: true,
    triggerDeps: [manager],
    flushData: false,
  })

  const consumedSize = fileInfo?.totalSize
  const allowedSize = accountBalance ? accountBalance * mbPerAleph : undefined

  // -----------------------------

  return {
    consumedSize,
    allowedSize,
  }
}
