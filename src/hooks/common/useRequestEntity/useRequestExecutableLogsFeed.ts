import { useEffect, useState } from 'react'
import { Future } from '@/helpers/utils'
import { useInstanceManager } from '../useManager/useInstanceManager'

export type UseRequestExecutableLogsFeedProps = {
  vmId: string
  nodeUrl: string
}

export type UseRequestExecutableLogsFeedReturn = {
  logs: string
}

export function useRequestExecutableLogsFeed({
  nodeUrl,
  vmId,
}: UseRequestExecutableLogsFeedProps): UseRequestExecutableLogsFeedReturn {
  const manager = useInstanceManager()

  // -----------------------------

  const [logs, setLogs] = useState<string>('')

  useEffect(() => {
    const abort = new Future<void>()

    async function subscribe() {
      if (!manager) return
      if (!nodeUrl) return
      if (!vmId) return

      const keyPair = await manager.getKeyPair()
      const authPubkey = await manager.getAuthPubkeyToken({
        url: nodeUrl,
        keyPair,
      })

      const iterator = manager.subscribeLogs({
        abort: abort.promise,
        vmId,
        authPubkey,
        hostname: nodeUrl,
        keyPair,
      })

      for await (const data of iterator) {
        setLogs((prev) => {
          console.log('prev', prev)
          console.log('data', data)
          return prev + data
        })
      }
    }

    subscribe()

    return () => abort.resolve()
  }, [manager, nodeUrl, vmId])

  return { logs }
}
