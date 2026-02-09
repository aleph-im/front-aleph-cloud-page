import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDebounceState } from '@aleph-front/core'
import { PaymentMethod } from '@/helpers/constants'
import {
  ExecutableManager,
  SchedulerSimulateResponse,
} from '@/domain/executable'
import usePrevious from './usePrevious'

export type UseSchedulerAvailabilityProps = {
  vcpus: number
  memory: number
  disk: number
  paymentMethod: PaymentMethod
  enabled?: boolean
}

export type UseSchedulerAvailabilityReturn = {
  isAvailable: boolean
  isLoading: boolean
  refetch: () => Promise<SchedulerSimulateResponse>
}

export function useSchedulerAvailability({
  vcpus,
  memory,
  disk,
  paymentMethod,
  enabled = true,
}: UseSchedulerAvailabilityProps): UseSchedulerAvailabilityReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SchedulerSimulateResponse>({
    schedulable: true,
    reasons: [],
  })

  const requestIdRef = useRef(0)
  const hasInitialFetchRef = useRef(false)

  const shouldCheck = useMemo(
    () => enabled && paymentMethod === PaymentMethod.Hold,
    [enabled, paymentMethod],
  )

  const paramsString = useMemo(
    () => JSON.stringify({ vcpus, memory, disk, shouldCheck }),
    [vcpus, memory, disk, shouldCheck],
  )

  const debouncedParamsString = useDebounceState(paramsString, 1000)
  const prevDebouncedParamsString = usePrevious(debouncedParamsString)

  const fetchAvailability =
    useCallback(async (): Promise<SchedulerSimulateResponse> => {
      if (!shouldCheck || !vcpus || !memory || !disk) {
        return { schedulable: true, reasons: [] }
      }

      const currentRequestId = ++requestIdRef.current

      setIsLoading(true)
      try {
        const response = await ExecutableManager.checkSchedulerAvailability({
          vcpus,
          memory,
          disk,
        })

        if (currentRequestId === requestIdRef.current) {
          setResult(response)
        }

        return response
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false)
        }
      }
    }, [vcpus, memory, disk, shouldCheck])

  // Immediate first check on mount (no debounce delay)
  useEffect(() => {
    if (hasInitialFetchRef.current) return
    if (!shouldCheck || !vcpus || !memory || !disk) return

    hasInitialFetchRef.current = true
    fetchAvailability()
  }, [shouldCheck, vcpus, memory, disk, fetchAvailability])

  // Debounced checks for subsequent param changes
  useEffect(() => {
    // Skip if this is the initial fetch (already handled above)
    if (!hasInitialFetchRef.current) return

    if (
      debouncedParamsString !== prevDebouncedParamsString &&
      debouncedParamsString
    ) {
      fetchAvailability()
    }
  }, [debouncedParamsString, prevDebouncedParamsString, fetchAvailability])

  useEffect(() => {
    if (!shouldCheck) {
      setResult({ schedulable: true, reasons: [] })
    }
  }, [shouldCheck])

  return {
    isAvailable: result.schedulable,
    isLoading,
    refetch: fetchAvailability,
  }
}
