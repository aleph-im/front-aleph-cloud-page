import { useMemo } from 'react'
import { PaymentType } from '@aleph-sdk/message'
import { EntityPaymentProps, UseEntityPaymentReturn } from './types'
import { blockchains } from '@/domain/connect/base'

/**
 * Hook to format payment data for display
 * Takes raw data as input and returns formatted strings
 */
export function useEntityPayment({
  cost,
  paymentType,
  runningTime,
  startTime,
  blockchain,
  loading = false,
}: EntityPaymentProps): UseEntityPaymentReturn {
  // Calculate if payment is pay-as-you-go
  const isPAYG = useMemo(() => {
    return paymentType === PaymentType.superfluid
  }, [paymentType])

  // Format total spent amount
  const totalSpent = useMemo(() => {
    if (!cost) return 'N/A'
    if (!isPAYG) return cost.toString()
    if (!runningTime) return 'N/A'

    const runningTimeInHours = (runningTime % (3600 * 24)) / 3600
    return (cost * runningTimeInHours).toFixed(6)
  }, [cost, isPAYG, runningTime])

  // Format blockchain name
  const formattedBlockchain = useMemo(() => {
    if (!blockchain) return 'N/A'
    return blockchains[blockchain].name
  }, [blockchain])

  // Format flow rate to show daily cost
  const formattedFlowRate = useMemo(() => {
    if (!isPAYG) return 'N/A'
    if (!cost) return 'N/A'

    const dailyRate = cost * 24
    return `~${dailyRate.toFixed(4)}/day`
  }, [cost, isPAYG])

  // Format start date
  const formattedStartDate = useMemo(() => {
    if (!startTime) return 'N/A'

    const date = new Date(startTime * 1000)
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }, [startTime])

  // Format duration display
  const formattedDuration = useMemo(() => {
    if (!runningTime) return 'N/A'

    const days = Math.floor(runningTime / (3600 * 24))
    const hours = Math.floor((runningTime % (3600 * 24)) / 3600)
    const minutes = Math.floor((runningTime % 3600) / 60)
    const secs = Math.floor(runningTime % 60)

    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = secs.toString().padStart(2, '0')

    if (days > 0) {
      return `${days} ${days === 1 ? 'Day' : 'Days'} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    } else {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    }
  }, [runningTime])

  // Return formatted data
  return {
    isPAYG,
    totalSpent,
    formattedBlockchain,
    formattedFlowRate,
    formattedStartDate,
    formattedDuration,
    loading,
  }
}
