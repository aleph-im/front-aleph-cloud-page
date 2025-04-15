import { useState, useEffect } from 'react'
import { AnyEntity } from '@/helpers/utils'
import { useEntityManager } from '@/hooks/common/useManager/useEntityManager'
import { useHashToEntityType } from './useHashToEntityType'

export type UseHashToEntityProps = string | undefined
export type UseHashToEntityReturn = AnyEntity | undefined

export function useHashToEntity(
  hash: UseHashToEntityProps,
): UseHashToEntityReturn {
  const [entity, setType] = useState<UseHashToEntityReturn>(undefined)

  const type = useHashToEntityType(hash)
  const entityManager = useEntityManager(type)

  useEffect(() => {
    if (!hash) {
      setType(undefined)
      return
    }

    async function fetchEntity(hash: string) {
      if (!entityManager) return

      const entity = await entityManager.get(hash)
      setType(entity as AnyEntity)
    }

    fetchEntity(hash)
  }, [hash, entityManager])

  return entity
}
