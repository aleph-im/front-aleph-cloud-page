import { useEffect, useMemo, useState } from 'react'
import { Future } from '@/helpers/utils'
import { useInstanceManager } from '../useManager/useInstanceManager'
import { useDebounceState } from '@aleph-front/core'

export type UseRequestExecutableLogsFeedProps = {
  vmId?: string
  nodeUrl: string
  tail?: number
  subscribe?: boolean
}

export type UseRequestExecutableLogsFeedReturn =
  | {
      stdout: string
      stderr: string
    }
  | undefined

export function useRequestExecutableLogsFeed({
  nodeUrl,
  vmId,
  tail = 100,
  subscribe = true,
}: UseRequestExecutableLogsFeedProps): UseRequestExecutableLogsFeedReturn {
  const manager = useInstanceManager()

  // -----------------------------

  const [stdoutState, setStdout] = useState<string[]>([])
  const [stderrState, setStderr] = useState<string[]>([])

  const debouncedStdout = useDebounceState(stdoutState, 200)
  const debouncedStderr = useDebounceState(stderrState, 200)

  const stdout = useMemo(() => debouncedStdout.join('\n'), [debouncedStdout])
  const stderr = useMemo(() => debouncedStderr.join('\n'), [debouncedStderr])

  const isDisabled = useMemo(
    () => !manager || !nodeUrl || !vmId,
    [manager, nodeUrl, vmId],
  )

  useEffect(() => {
    const abort = new Future<void>()

    const subscribeFeed = async () => {
      if (!subscribe) return
      if (!manager) return
      if (!nodeUrl) return
      if (!vmId) return

      const iterator = manager.subscribeLogs({
        abort: abort.promise,
        vmId,
        hostname: nodeUrl,
      })

      try {
        for await (const data of iterator) {
          const setter = data.type === 'stdout' ? setStdout : setStderr

          setter((prevLogs) => {
            const newLogs = prevLogs.concat(data.message)
            return newLogs.slice(Math.max(newLogs.length - tail, 0))
          })
        }
      } catch (e) {
        console.error(e)
      }
    }

    subscribeFeed()

    return () => abort.resolve()
  }, [manager, nodeUrl, vmId, tail, subscribe])

  return isDisabled ? undefined : { stdout, stderr }
}
