import { useMemo, useState, useEffect } from 'react'
import { useAppState } from '@/contexts/appState'
import { MessageManager } from '@/domain/message'
import { EntityType } from '@/helpers/constants'
import { AnyMessage, getEntityTypeFromMessage } from '@/helpers/utils'

export function useMessageToEntityType(
  hash: string | undefined,
): EntityType | undefined {
  const [globalState] = useAppState()
  const { account } = globalState

  const messageManager = useMemo(
    () => (account ? new MessageManager(account) : undefined),
    [account],
  )

  const [type, setType] = useState<EntityType | undefined>(undefined)

  useEffect(() => {
    if (!hash) {
      setType(undefined)
      return
    }

    async function fetchMessage(hash: string) {
      if (!messageManager) return

      const msg = (await messageManager.get(hash)) as AnyMessage
      const type = getEntityTypeFromMessage(msg)
      setType(type)
    }

    fetchMessage(hash)
  }, [hash, messageManager])

  return type
}
