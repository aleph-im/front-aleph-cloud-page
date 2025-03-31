import { useMemo } from 'react'
import { PaymentType } from '@aleph-sdk/message'
import { PaymentData, StreamPaymentData, UseEntityPaymentReturn } from './types'
import { blockchains } from '@/domain/connect/base'
import { communityWalletAddress } from '@/helpers/constants'

// Helper to convert seconds into days, hours, minutes, and seconds
function getTimeComponents(totalSeconds: number) {
  const days = Math.floor(totalSeconds / (3600 * 24))
  const remainder = totalSeconds % (3600 * 24)
  const hours = Math.floor(remainder / 3600)
  const minutes = Math.floor((remainder % 3600) / 60)
  const seconds = Math.floor(remainder % 60)

  return { days, hours, minutes, seconds }
}

/**
 * Hook to format payment data for display
 * Takes raw payment data as input and returns formatted strings
 */
export function useFormatPayment(
  paymentData: PaymentData,
): UseEntityPaymentReturn {
  const {
    cost,
    paymentType,
    runningTime,
    startTime,
    blockchain,
    loading = false,
  } = paymentData

  // Get stream-specific data if this is a stream payment
  const receiver = useMemo(() => {
    if (paymentType !== PaymentType.superfluid) return

    return (paymentData as StreamPaymentData).receiver
  }, [paymentData, paymentType])

  // Determine if payment is pay-as-you-go
  const isPAYG = useMemo(
    () => paymentType === PaymentType.superfluid,
    [paymentType],
  )

  // Format total spent amount using the time components for PAYG type
  const totalSpent = useMemo(() => {
    if (!cost) return
    if (!isPAYG) return cost.toString()
    if (!runningTime) return

    // Use only the remainder (hours, minutes, seconds) from runningTime
    const { days, hours, minutes } = getTimeComponents(runningTime)
    const runningTimeInHours = days * 24 + hours + minutes / 60
    return (cost * runningTimeInHours).toFixed(6)
  }, [cost, isPAYG, runningTime])

  // Format blockchain name
  const formattedBlockchain = useMemo(() => {
    if (!blockchain) return
    return blockchains[blockchain].name
  }, [blockchain])

  // Format flow rate to show daily cost
  const formattedFlowRate = useMemo(() => {
    if (!isPAYG) return
    if (!cost) return

    const dailyRate = cost * 24
    return `~${dailyRate.toFixed(4)}/day`
  }, [cost, isPAYG])

  // Format start date
  const formattedStartDate = useMemo(() => {
    if (!startTime) return

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

  // Format duration display using the same helper
  const formattedDuration = useMemo(() => {
    if (!runningTime) return

    const { days, hours, minutes, seconds } = getTimeComponents(runningTime)
    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')

    if (days > 0) {
      return `${days} ${days === 1 ? 'Day' : 'Days'} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    } else {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    }
  }, [runningTime])

  // Determine receiver type for streams
  const receiverType = useMemo(() => {
    if (!receiver) return undefined

    console.log('Receiver address:', receiver)
    console.log('communityWalletAddress:', communityWalletAddress)
    if (receiver == (communityWalletAddress as string)) {
      return 'Community Wallet (20%)'
    }
    return 'Node Operator (80%)'
  }, [receiver])

  return {
    isPAYG,
    totalSpent,
    formattedBlockchain,
    formattedFlowRate,
    formattedStartDate,
    formattedDuration,
    loading,
    receiverType,
  }
}
