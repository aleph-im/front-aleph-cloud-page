import { useCallback, useEffect, useRef, useState } from 'react'

export type UsePollingUntilProps<T> = {
  fetchFn: () => Promise<T>
  conditionFn: (data: T) => boolean
  interval?: number
  maxAttempts?: number
  enabled?: boolean
  onConditionMet?: (data: T) => void
  onData?: (data: T) => void
  onMaxAttemptsReached?: () => void
}

export type UsePollingUntilReturn<T> = {
  data: T | undefined
  isPolling: boolean
  error: Error | undefined
  stop: () => void
}

const DEFAULT_INTERVAL = 3000
const DEFAULT_MAX_ATTEMPTS = 60

export function usePollingUntil<T>({
  fetchFn,
  conditionFn,
  interval = DEFAULT_INTERVAL,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  enabled = true,
  onConditionMet,
  onData,
  onMaxAttemptsReached,
}: UsePollingUntilProps<T>): UsePollingUntilReturn<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [isPolling, setIsPolling] = useState(false)

  const attemptRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isFetchingRef = useRef(false)

  // Use refs to avoid re-triggering effects when callbacks change
  const fetchFnRef = useRef(fetchFn)
  const conditionFnRef = useRef(conditionFn)
  const onConditionMetRef = useRef(onConditionMet)
  const onDataRef = useRef(onData)
  const onMaxAttemptsReachedRef = useRef(onMaxAttemptsReached)

  useEffect(() => {
    fetchFnRef.current = fetchFn
  }, [fetchFn])

  useEffect(() => {
    conditionFnRef.current = conditionFn
  }, [conditionFn])

  useEffect(() => {
    onConditionMetRef.current = onConditionMet
  }, [onConditionMet])

  useEffect(() => {
    onDataRef.current = onData
  }, [onData])

  useEffect(() => {
    onMaxAttemptsReachedRef.current = onMaxAttemptsReached
  }, [onMaxAttemptsReached])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPolling(false)
  }, [])

  const doFetch = useCallback(async () => {
    if (isFetchingRef.current) return

    isFetchingRef.current = true
    try {
      const result = await fetchFnRef.current()
      setData(result)
      setError(undefined)

      onDataRef.current?.(result)

      if (conditionFnRef.current(result)) {
        stop()
        onConditionMetRef.current?.(result)
        return
      }

      attemptRef.current += 1
      if (attemptRef.current >= maxAttempts) {
        stop()
        onMaxAttemptsReachedRef.current?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      isFetchingRef.current = false
    }
  }, [maxAttempts, stop])

  useEffect(() => {
    if (!enabled) {
      stop()
      return
    }

    // Start polling
    attemptRef.current = 0
    setIsPolling(true)

    // Initial fetch
    doFetch()

    // Set up interval
    intervalRef.current = setInterval(doFetch, interval)

    return () => {
      stop()
    }
    // Only re-run when enabled or interval changes, not when doFetch changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, interval])

  return {
    data,
    isPolling,
    error,
    stop,
  }
}
