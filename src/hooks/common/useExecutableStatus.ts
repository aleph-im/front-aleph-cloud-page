import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Executable,
  ExecutableCalculatedStatus,
  ExecutableStatus,
} from '@/domain/executable'
import { ExecutableManager } from '@/domain/executable'
import { calculateExecutableStatus } from '@/helpers/executableStatus'

export type UseExecutableStatusProps = {
  executable: Executable | undefined
  manager?: ExecutableManager<any>
}

export type UseExecutableStatusReturn = {
  status?: ExecutableStatus
  calculatedStatus: ExecutableCalculatedStatus
}

export function useExecutableStatus({
  executable,
  manager,
}: UseExecutableStatusProps): UseExecutableStatusReturn {
  const [status, setStatus] =
    useState<UseExecutableStatusReturn['status']>(undefined)
  const [hasTriedFetchingStatus, setHasTriedFetchingStatus] = useState(false)

  const calculatedStatus: ExecutableCalculatedStatus = useMemo(() => {
    return calculateExecutableStatus(
      hasTriedFetchingStatus,
      status,
      executable?.type,
    )
  }, [hasTriedFetchingStatus, status, executable?.type])

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
