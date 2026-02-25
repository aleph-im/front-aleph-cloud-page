import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Executable,
  ExecutableCalculatedStatus,
  ExecutableStatus,
} from '@/domain/executable'
import { RequestState } from '@aleph-front/core'
import { useInstanceManager } from '../useManager/useInstanceManager'
import { calculateExecutableStatus } from '@/helpers/executableStatus'

const BOOST_INTERVAL_MS = 2000
const BOOST_MAX_REQUESTS = 10

export type UseRequestExecutableStatusProps = {
  entities?: Executable[]
  //@todo: fix managerHook type
  managerHook?: any
}

export type BoostPollingOptions = {
  entityId: string
  enforcedStatus: ExecutableCalculatedStatus
  expectedStatuses?: ExecutableCalculatedStatus[]
  onComplete?: () => void
}

export type UseRequestExecutableStatusReturn = {
  status: Record<string, RequestState<ExecutableStatus>>
  loading: boolean
  enforcedStatuses: Record<string, ExecutableCalculatedStatus | undefined>
  triggerBoostPolling: (options: BoostPollingOptions) => void
}

export function useRequestExecutableStatus({
  entities,
  managerHook = useInstanceManager,
}: UseRequestExecutableStatusProps): UseRequestExecutableStatusReturn {
  const manager = managerHook()

  const [status, setStatus] = useState<
    Record<string, RequestState<ExecutableStatus>>
  >({})
  const [loading, setLoading] = useState<boolean>(true)
  const [enforcedStatuses, setEnforcedStatuses] = useState<
    Record<string, ExecutableCalculatedStatus | undefined>
  >({})

  // Track which IDs have been fetched to avoid re-fetching
  const fetchedIdsRef = useRef<Set<string>>(new Set())

  // Track active boost polling intervals per entity
  const boostIntervalsRef = useRef<Record<string, NodeJS.Timeout>>({})
  const boostCountsRef = useRef<Record<string, number>>({})

  useEffect(() => {
    const load = async () => {
      if (!entities?.length) {
        setLoading(false)
        return
      }

      // Filter entities that haven't been fetched yet
      const entitiesToFetch = entities.filter(
        (executable) => !fetchedIdsRef.current.has(executable.id),
      )

      if (entitiesToFetch.length === 0) {
        setLoading(false)
        return
      }

      // Mark as fetching (to prevent duplicate fetches)
      entitiesToFetch.forEach((executable) => {
        fetchedIdsRef.current.add(executable.id)
      })

      // Set initial loading state for all entities to fetch
      setStatus((prev) => {
        const updates = { ...prev }
        entitiesToFetch.forEach((executable) => {
          updates[executable.id] = {
            loading: true,
            data: undefined,
            error: undefined,
          }
        })
        return updates
      })

      // Fetch all in parallel
      await Promise.allSettled(
        entitiesToFetch.map(async (executable) => {
          const data = await manager?.checkStatus(executable)

          setStatus((prev) => ({
            ...prev,
            [executable.id]: {
              data,
              loading: false,
              error: undefined,
            },
          }))
        }),
      )

      setLoading(false)
    }

    load()
  }, [manager, entities])

  // Boost polling for individual entities after action buttons are pressed
  const triggerBoostPolling = useCallback(
    (options: BoostPollingOptions) => {
      const { entityId, enforcedStatus, expectedStatuses, onComplete } = options

      const entity = entities?.find((e) => e.id === entityId)
      if (!manager || !entity) return

      // Clear any existing interval for this entity
      if (boostIntervalsRef.current[entityId]) {
        clearInterval(boostIntervalsRef.current[entityId])
      }

      // Set the enforced status
      setEnforcedStatuses((prev) => ({
        ...prev,
        [entityId]: enforcedStatus,
      }))

      boostCountsRef.current[entityId] = 0

      const stopBoostPolling = () => {
        if (boostIntervalsRef.current[entityId]) {
          clearInterval(boostIntervalsRef.current[entityId])
          delete boostIntervalsRef.current[entityId]
        }
        // Clear the enforced status
        setEnforcedStatuses((prev) => ({
          ...prev,
          [entityId]: undefined,
        }))
        onComplete?.()
      }

      const boostRequest = async () => {
        boostCountsRef.current[entityId]++

        if (boostCountsRef.current[entityId] >= BOOST_MAX_REQUESTS) {
          stopBoostPolling()
          return
        }

        try {
          const data = await manager.checkStatus(entity)

          setStatus((prev) => ({
            ...prev,
            [entityId]: {
              data,
              loading: false,
              error: undefined,
            },
          }))

          if (expectedStatuses?.length) {
            const newCalculatedStatus = calculateExecutableStatus(
              true,
              data,
              entity.type,
            )

            if (expectedStatuses.includes(newCalculatedStatus)) {
              stopBoostPolling()
            }
          }
        } catch {
          // Silently fail on boost requests
        }
      }

      // Initial request
      boostRequest()

      // Start interval
      boostIntervalsRef.current[entityId] = setInterval(
        boostRequest,
        BOOST_INTERVAL_MS,
      )
    },
    [manager, entities],
  )

  // Cleanup boost intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(boostIntervalsRef.current).forEach((interval) => {
        clearInterval(interval)
      })
    }
  }, [])

  return {
    status,
    loading,
    enforcedStatuses,
    triggerBoostPolling,
  }
}
