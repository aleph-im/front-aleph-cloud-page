import {
  ExecutableCalculatedStatus,
  ExecutableStatus,
} from '@/domain/executable'
import { EntityType } from '@/helpers/constants'

/**
 * Calculates the status of an executable based on its status data and type
 * @param hasTriedFetchingStatus Whether status fetch has been attempted
 * @param status The executable status data (undefined if not fetched)
 * @param executableType The type of executable (Program, Instance, etc.)
 * @returns The calculated status
 */
export function calculateExecutableStatus(
  hasTriedFetchingStatus: boolean,
  status: ExecutableStatus | undefined,
  executableType?:
    | EntityType.Instance
    | EntityType.GpuInstance
    | EntityType.Confidential
    | EntityType.Program,
): ExecutableCalculatedStatus {
  if (!hasTriedFetchingStatus) return 'loading'
  if (status?.version === 'v1') return 'v1'
  if (executableType === EntityType.Program) return 'v1'

  const latestStatus = getLatestStatusTimestamp(status)
  if (!latestStatus) return 'not-allocated'

  switch (latestStatus.latestKey) {
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
}

/**
 * Finds the latest status timestamp from the status object
 * @param status The executable status data
 * @returns Object with latest key and timestamp, or undefined if none found
 */
function getLatestStatusTimestamp(
  status: ExecutableStatus | undefined,
): { latestKey: string; latestTime: number } | undefined {
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
}
