import { useCallback, useEffect, useMemo, useState } from 'react'
import { Executable, ExecutableStatus } from '@/domain/executable'
import { ExecutableManager } from '@/domain/executable'

export type ExecutableCalculatedStatus =
  | 'not-allocated'
  | 'stopped'
  | 'stopping'
  | 'running'
  | 'preparing'

export type UseExecutableStatusProps = {
  executable: Executable | undefined
  manager?: ExecutableManager<any>
}

export type UseExecutableStatusReturn = {
  calculatedStatus: ExecutableCalculatedStatus
  status: ExecutableStatus | undefined
}

export function useExecutableStatus({
  executable,
  manager,
}: UseExecutableStatusProps): UseExecutableStatusReturn {
  const [status, setStatus] =
    useState<UseExecutableStatusReturn['status']>(undefined)

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

  const calculatedStatus: ExecutableCalculatedStatus = useMemo(() => {
    const latest = latestStatus()

    console.log('latest', latest)

    if (!latest) return 'not-allocated'

    const { latestKey } = latest

    switch (latestKey) {
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
  }, [latestStatus])

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

      const fetchedStatus = await manager.checkStatus(executable)

      setStatus(fetchedStatus)
    }

    if (shouldFetchStatus()) request()

    const id = setInterval(request, 10 * 1000)
    return () => clearInterval(id)
  }, [shouldFetchStatus, status, executable, manager])

  return { status, calculatedStatus }
}
