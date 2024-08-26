import { useEffect, useState } from 'react'
import { useConfidentialManager } from './useManager/useConfidentialManager'
import { Confidential, ConfidentialStatus } from '@/domain/confidential'

export type UseConfidentialStatusProps = Confidential | undefined

export type UseConfidentialStatusReturn = ConfidentialStatus | undefined

export function useConfidentialStatus(
  confidential: UseConfidentialStatusProps,
): UseConfidentialStatusReturn {
  const [status, setStatus] = useState<ConfidentialStatus>(undefined)

  const manager = useConfidentialManager()

  useEffect(() => {
    if (!manager) return
    if (!confidential) return
    if (status) return

    async function request() {
      if (!manager) return
      if (!confidential) return

      const status = await manager.checkStatus(confidential)
      setStatus(status)
    }

    if (!status) request()

    const id = setInterval(request, 10 * 1000)
    return () => clearInterval(id)
  }, [status, confidential, manager])

  return status
}
