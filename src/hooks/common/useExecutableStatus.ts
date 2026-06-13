import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

export type BoostPollingOptions = {
  expectedStatuses?: ExecutableCalculatedStatus[]
  onComplete?: () => void
}

export type UseExecutableStatusReturn = {
  status?: ExecutableStatus
  calculatedStatus: ExecutableCalculatedStatus
  triggerBoostPolling: (options?: BoostPollingOptions) => void
}

const BOOST_INTERVAL_MS = 2000
const BOOST_MAX_REQUESTS = 10
// Per-request hard ceiling. A hung CRN/scheduler fetch must not leave the
// badge stuck on LOADING; on timeout we transition to 'not-allocated' and
// the next poll tick retries.
const REQUEST_TIMEOUT_MS = 10_000

type InflightRequest = {
  controller: AbortController
  supersede: () => void
}

export function useExecutableStatus({
  executable,
  manager,
}: UseExecutableStatusProps): UseExecutableStatusReturn {
  const [status, setStatus] =
    useState<UseExecutableStatusReturn['status']>(undefined)
  const [hasTriedFetchingStatus, setHasTriedFetchingStatus] = useState(false)

  const boostIntervalRef = useRef<NodeJS.Timeout>()
  const boostCountRef = useRef(0)
  const isBoostActiveRef = useRef(false)
  const onBoostCompleteRef = useRef<(() => void) | undefined>()
  const inflightRef = useRef<InflightRequest | null>(null)

  const calculatedStatus: ExecutableCalculatedStatus = useMemo(() => {
    return calculateExecutableStatus(
      hasTriedFetchingStatus,
      status,
      executable?.type,
    )
  }, [hasTriedFetchingStatus, status, executable?.type])

  // Use ref to access current status in interval without triggering re-renders
  const calculatedStatusRef = useRef(calculatedStatus)
  calculatedStatusRef.current = calculatedStatus

  // Status fetch request - Retries fetch every 10 seconds until status is running
  useEffect(() => {
    if (!manager) return
    if (!executable) return

    const cancelInflight = () => {
      const inflight = inflightRef.current
      if (!inflight) return
      inflightRef.current = null
      inflight.supersede()
    }

    async function request() {
      if (!manager) return
      if (!executable) return
      if (isBoostActiveRef.current) return

      cancelInflight()

      const controller = new AbortController()
      let superseded = false
      let timedOut = false

      const inflight: InflightRequest = {
        controller,
        supersede: () => {
          superseded = true
          controller.abort()
        },
      }
      inflightRef.current = inflight

      const timeoutId = setTimeout(() => {
        timedOut = true
        controller.abort()
      }, REQUEST_TIMEOUT_MS)

      try {
        const fetchedStatus = await manager.checkStatus(
          executable,
          controller.signal,
        )
        if (superseded) return
        setStatus(fetchedStatus)
        setHasTriedFetchingStatus(true)
      } catch (e) {
        if (superseded) return
        if (timedOut) {
          console.warn(
            `Executable status fetch timed out after ${REQUEST_TIMEOUT_MS}ms`,
            executable?.id,
          )
        } else {
          console.warn('Executable status fetch failed', e)
        }
        setHasTriedFetchingStatus(true)
      } finally {
        clearTimeout(timeoutId)
        if (inflightRef.current === inflight) {
          inflightRef.current = null
        }
      }
    }

    // Initial request on mount
    request()

    // Poll every 10 seconds, skip if already running
    const id = setInterval(() => {
      if (calculatedStatusRef.current === 'running') return
      request()
    }, 10 * 1000)

    return () => {
      clearInterval(id)
      cancelInflight()
    }
  }, [executable, manager])

  // Boost polling - fast polling after action buttons are pressed
  const triggerBoostPolling = useCallback(
    (options?: BoostPollingOptions) => {
      if (!manager || !executable) return

      const { expectedStatuses, onComplete } = options || {}

      if (boostIntervalRef.current) {
        clearInterval(boostIntervalRef.current)
      }

      boostCountRef.current = 0
      isBoostActiveRef.current = true
      onBoostCompleteRef.current = onComplete

      const stopBoostPolling = () => {
        if (boostIntervalRef.current) {
          clearInterval(boostIntervalRef.current)
        }
        isBoostActiveRef.current = false
        onBoostCompleteRef.current?.()
        onBoostCompleteRef.current = undefined
      }

      const boostRequest = async () => {
        if (!manager || !executable) return

        boostCountRef.current++

        if (boostCountRef.current >= BOOST_MAX_REQUESTS) {
          stopBoostPolling()
          return
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(
          () => controller.abort(),
          REQUEST_TIMEOUT_MS,
        )

        try {
          const fetchedStatus = await manager.checkStatus(
            executable,
            controller.signal,
          )
          setStatus(fetchedStatus)
          setHasTriedFetchingStatus(true)

          if (expectedStatuses?.length) {
            const newCalculatedStatus = calculateExecutableStatus(
              true,
              fetchedStatus,
              executable?.type,
            )

            if (expectedStatuses.includes(newCalculatedStatus)) {
              stopBoostPolling()
            }
          }
        } catch {
          // Silently fail on boost requests
        } finally {
          clearTimeout(timeoutId)
        }
      }

      boostRequest()

      boostIntervalRef.current = setInterval(boostRequest, BOOST_INTERVAL_MS)
    },
    [manager, executable],
  )

  // Cleanup boost polling on unmount
  useEffect(() => {
    return () => {
      if (boostIntervalRef.current) {
        clearInterval(boostIntervalRef.current)
      }
    }
  }, [])

  return { status, calculatedStatus, triggerBoostPolling }
}
