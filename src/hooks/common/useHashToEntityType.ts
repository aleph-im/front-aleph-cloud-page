import { useState, useEffect } from 'react'
import { EntityType } from '@/helpers/constants'
import { AnyMessage, getEntityTypeFromMessage } from '@/helpers/utils'
import { useMessageManager } from '@/hooks/common/useManager/useMessageManager'

export type UseHashToEntityTypeProps = string | undefined
export type UseHashToEntityTypeReturn = EntityType | undefined

export function useHashToEntityType(
  hash: UseHashToEntityTypeProps,
): UseHashToEntityTypeReturn {
  const [type, setType] = useState<UseHashToEntityTypeReturn>(undefined)
  const manager = useMessageManager()

  useEffect(() => {
    if (!hash) {
      setType(undefined)
      return
    }

    async function checkType(hash: string) {
      if (parseHash(hash)) return
      fetchMessage(hash)
    }

    function parseHash(hash: string): boolean {
      const [, type, id] = hash.split('/')
      if (
        typeof type === 'string' &&
        typeof id === 'string' &&
        Object.values(EntityType).includes(type as EntityType)
      ) {
        setType(type as EntityType)
        return true
      }

      return false
    }

    async function fetchMessage(hash: string) {
      if (!manager) return

      const msg = (await manager.get(hash)) as AnyMessage
      const type = getEntityTypeFromMessage(msg)
      setType(type)
    }

    checkType(hash)
  }, [hash, manager])

  return type
}
