import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Executable,
  ExecutableCalculatedStatus,
  ExecutableStatus,
} from '@/domain/executable'
import { ExecutableManager } from '@/domain/executable'

export type UseExecutableStatusProps = {
  executable: Executable | undefined
  manager?: ExecutableManager<any>
}

export type UseExecutableStatusReturn = {
  status?: ExecutableStatus
  calculatedStatus?: ExecutableCalculatedStatus
}

export function useExecutableStatus({
  executable,
  manager,
}: UseExecutableStatusProps): UseExecutableStatusReturn {
  const [status, setStatus] =
    useState<UseExecutableStatusReturn['status']>(undefined)
  const [hasTriedFetchingStatus, setHasTriedFetchingStatus] = useState(false)

  const latestStatus = useCallback(() => {
    if (!status?.status) return

    let latestKey: string | undefined
    let latestTime = -Infinity

    for (const [key, value] of Object.entries(status.status)) {
      if (!key.endsWith('At')) continue
      if (value === null) continue

      const t = new Date(value as string).getTime()
      if (t > latestTime) {
        latestTime = t
        latestKey = key
      }
    }

    if (!latestKey) return

    return { latestKey, latestTime }
  }, [status])

  const calculatedStatus: ExecutableCalculatedStatus | undefined =
    useMemo(() => {
      if (!hasTriedFetchingStatus) return 'loading'
      if (status?.version === 'v1') return

      const latest = latestStatus()
      if (!latest) return 'not-allocated'

      switch (latest.latestKey) {
        case 'stoppedAt':
          return 'stopped'
        case 'stoppingAt':
          return 'stopping'
        case 'startedAt':
          return 'running'
        case 'preparingAt':
          return 'preparing'
        default:
          return 'not-allocated'
      }
    }, [hasTriedFetchingStatus, status?.version, latestStatus])

  const shouldFetchStatus = useCallback(
    () => calculatedStatus !== 'running',
    [calculatedStatus],
  )

  // Status fetch request - Retries fetch every 10 seconds until status is running
  useEffect(() => {
    if (!manager) return
    if (!executable) return
    if (!shouldFetchStatus()) return

    async function request() {
      if (!manager) return
      if (!executable) return

      try {
        const fetchedStatus = await manager.checkStatus(executable)

        setStatus(fetchedStatus)
      } finally {
        setHasTriedFetchingStatus(true)
      }
    }

    if (shouldFetchStatus()) request()

    const id = setInterval(request, 10 * 1000)
    return () => clearInterval(id)
  }, [shouldFetchStatus, status, executable, manager])

  return { status, calculatedStatus }
}
