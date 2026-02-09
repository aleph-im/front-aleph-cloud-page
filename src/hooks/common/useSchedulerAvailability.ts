import { useCallback, useEffect, useMemo, useState } from 'react'
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
  reasons: string[]
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

      setIsLoading(true)
      try {
        const response = await ExecutableManager.checkSchedulerAvailability({
          vcpus,
          memory,
          disk,
        })
        setResult(response)
        return response
      } finally {
        setIsLoading(false)
      }
    }, [vcpus, memory, disk, shouldCheck])

  useEffect(() => {
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
    reasons: result.reasons,
    isLoading,
    refetch: fetchAvailability,
  }
}
