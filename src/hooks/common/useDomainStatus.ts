import { useEffect, useState } from 'react'
import { useDomainManager } from './useManager/useDomainManager'
import { Domain, DomainStatus } from '@/domain/domain'

export type UseDomainStatusProps = Domain | undefined

export type UseDomainStatusReturn = DomainStatus | undefined

export function useDomainStatus(
  domain: UseDomainStatusProps,
): UseDomainStatusReturn {
  const [status, setStatus] = useState<DomainStatus | undefined>(undefined)

  const manager = useDomainManager()

  useEffect(() => {
    if (!manager) return
    if (!domain) return
    if (status?.status) return

    async function request() {
      if (!manager) return
      if (!domain) return

      const status = await manager.checkStatus(domain)
      setStatus(status)
    }

    if (!status) request()

    const id = setTimeout(request, 10 * 1000)
    return () => clearTimeout(id)
  }, [status, domain, manager])

  return status
}
