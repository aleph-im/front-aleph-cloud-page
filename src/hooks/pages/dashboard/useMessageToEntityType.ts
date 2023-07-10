import { useState, useEffect } from 'react'
import { EntityType } from '@/helpers/constants'
import { AnyMessage, getEntityTypeFromMessage } from '@/helpers/utils'
import { useMessageManager } from '@/hooks/common/useMessageManager'

export function useMessageToEntityType(
  hash: string | undefined,
): EntityType | undefined {
  const [type, setType] = useState<EntityType | undefined>(undefined)
  const manager = useMessageManager()

  useEffect(() => {
    if (!hash) {
      setType(undefined)
      return
    }

    async function fetchMessage(hash: string) {
      if (!manager) return

      const msg = (await manager.get(hash)) as AnyMessage
      const type = getEntityTypeFromMessage(msg)
      setType(type)
    }

    fetchMessage(hash)
  }, [hash, manager])

  return type
}
