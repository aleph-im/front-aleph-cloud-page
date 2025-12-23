import { useMemo } from 'react'
import { PaymentType } from '@aleph-sdk/message'
import { PaymentData, StreamPaymentData, UseEntityPaymentReturn } from './types'
import { blockchains } from '@/domain/connect'
import { communityWalletAddress } from '@/helpers/constants'
import { useCopyToClipboardAndNotify, useLocalRequest } from '@aleph-front/core'
import { getApiServer } from '@/helpers/server'

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
    itemHash,
  } = paymentData

  // Get stream-specific data if this is a stream payment
  const receiver = useMemo(() => {
    if (paymentType !== PaymentType.superfluid) return

    return (paymentData as StreamPaymentData).receiver
  }, [paymentData, paymentType])

  // Determine if payment is pay-as-you-go
  const isStream = useMemo(
    () => paymentType === PaymentType.superfluid,
    [paymentType],
  )

  // Determine if payment is pay-as-you-go
  const isCredit = useMemo(
    () => paymentType === PaymentType.credit,
    [paymentType],
  )

  // Fetch consumed credits for credit payment type using useLocalRequest
  const {
    data: consumedCreditsData,
    loading: creditsLoading,
    error: creditsError,
  } = useLocalRequest<{ item_hash: string; consumed_credits: number }>({
    doRequest: async () => {
      if (!itemHash) throw new Error('No item hash provided')

      const apiServer = getApiServer()
      const response = await fetch(
        `${apiServer}/api/v0/messages/${itemHash}/consumed_credits`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    },
    onSuccess: () => null,
    onError: () => null,
    flushData: false,
    triggerOnMount: isCredit && !!itemHash,
    triggerDeps: [isCredit, itemHash],
  })

  const consumedCredits = consumedCreditsData?.consumed_credits

  // Calculate fallback totalSpent using original logic
  const fallbackTotalSpent = useMemo(() => {
    if (!cost) return
    if (!isStream && !isCredit) return cost.toString()
    if (!runningTime) return

    // Use only the remainder (hours, minutes, seconds) from runningTime
    const { days, hours, minutes } = getTimeComponents(runningTime)
    const runningTimeInHours = days * 24 + hours + minutes / 60

    return Math.round(cost * runningTimeInHours)
  }, [cost, isStream, isCredit, runningTime])

  // Format total spent amount - use consumed credits for credit type, fallback to calculation
  const totalSpent = useMemo(() => {
    // For credit payment type, try to use consumed credits from API
    if (isCredit) {
      // If we have consumed credits data, use it
      if (consumedCredits !== undefined) {
        return consumedCredits
      }
      // If API request failed or is loading, use fallback calculation
      if (creditsError || creditsLoading) {
        return fallbackTotalSpent
      }
      // If no data and no error/loading, return undefined
      return undefined
    }

    // For non-credit types, use fallback calculation
    return fallbackTotalSpent
  }, [
    isCredit,
    consumedCredits,
    creditsError,
    creditsLoading,
    fallbackTotalSpent,
  ])

  // Format blockchain name
  const formattedBlockchain = useMemo(() => {
    if (!blockchain) return
    return blockchains[blockchain].name
  }, [blockchain])

  // Format flow rate to show daily cost
  const formattedFlowRate = useMemo(() => {
    if (!isStream && !isCredit) return
    if (!cost) return

    const dailyRate = Math.round(cost * 24)

    return `~${dailyRate}/day`
  }, [cost, isCredit, isStream])

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

    if (receiver == (communityWalletAddress as string)) {
      return 'Community Wallet (20%)'
    }
    return 'Node Operator (80%)'
  }, [receiver])

  const handleCopyReceiverAddress = useCopyToClipboardAndNotify(receiver || '')

  return {
    isStream,
    isCredit,
    totalSpent,
    formattedBlockchain,
    formattedFlowRate,
    formattedStartDate,
    formattedDuration,
    loading: loading || (isCredit && creditsLoading && !creditsError),
    receiverAddress: receiver,
    receiverType,
    handleCopyReceiverAddress,
  }
}
