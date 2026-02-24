import { useEffect, useState } from 'react'
import { useDomainManager } from './useManager/useDomainManager'
import { Domain, DomainRule } from '@/domain/domain'

export type UseDomainRulesReturn = DomainRule[] | undefined

export function useDomainRules(
  domain: Pick<Domain, 'name' | 'target'> | undefined,
): UseDomainRulesReturn {
  const [rules, setRules] = useState<DomainRule[] | undefined>(undefined)

  const manager = useDomainManager()

  const name = domain?.name
  const target = domain?.target

  useEffect(() => {
    if (!manager) return
    if (!name || !target) {
      setRules(undefined)
      return
    }

    async function request() {
      if (!manager || !name || !target) return

      const result = await manager.getRules({ name, target })
      setRules(result)
    }

    request()
  }, [name, target, manager])

  return rules
}
