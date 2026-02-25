import { useEffect, useState } from 'react'
import { useDomainManager } from './useManager/useDomainManager'
import { Domain, DomainStatus } from '@/domain/domain'

export type UseDomainStatusesReturn = Map<string, DomainStatus>

export function useDomainStatuses(domains: Domain[]): UseDomainStatusesReturn {
  const [statuses, setStatuses] = useState<Map<string, DomainStatus>>(new Map())
  const manager = useDomainManager()

  useEffect(() => {
    if (!manager) return
    if (!domains.length) return

    async function request() {
      if (!manager) return

      const results = await Promise.allSettled(
        domains.map((d) => manager.checkStatus(d)),
      )

      const next = new Map<string, DomainStatus>()
      domains.forEach((d, i) => {
        const result = results[i]
        if (result.status === 'fulfilled') {
          next.set(d.id, result.value)
        }
      })

      setStatuses(next)
    }

    request()

    const id = setInterval(request, 30 * 1000)
    return () => clearInterval(id)
  }, [domains, manager])

  return statuses
}
