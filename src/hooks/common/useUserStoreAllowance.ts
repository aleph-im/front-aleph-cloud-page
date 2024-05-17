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
  const { balance = 0 } = state.connection

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
  const allowedSize = balance ? balance * mbPerAleph : undefined

  // -----------------------------

  return {
    consumedSize,
    allowedSize,
  }
}
