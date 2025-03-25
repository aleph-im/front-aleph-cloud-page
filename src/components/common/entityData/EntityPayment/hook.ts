import { useEffect, useMemo, useState } from 'react'
import { PaymentType } from '@aleph-sdk/message'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import {
  EntityPaymentProps,
  PaymentData,
  UseEntityPaymentReturn,
} from './types'
import { blockchains } from '@/domain/connect/base'

/**
 * Hook to get and format payment data for an entity
 */
export function useEntityPayment({
  instance,
  paymentType,
}: EntityPaymentProps): UseEntityPaymentReturn {
  const [cost, setCost] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)
  const instanceManager = useInstanceManager()

  // Fetch cost data from the API
  useEffect(() => {
    const fetchCost = async () => {
      if (!instance?.payment) return

      setLoading(true)

      try {
        const fetchedCost = await instanceManager?.getTotalCostByHash(
          instance.payment.type,
          instance.id,
        )
        setCost(fetchedCost)
      } catch (error) {
        console.error('Error fetching cost:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCost()
  }, [instance, instanceManager])

  // Calculate running time in seconds
  const runningTime = useMemo(() => {
    return instance?.time
      ? Math.floor(Date.now() - instance.time * 1000) / 1000
      : undefined
  }, [instance?.time])

  // Final payment type, either from props or instance
  const finalPaymentType = useMemo(() => {
    return paymentType || instance?.payment?.type || PaymentType.hold
  }, [paymentType, instance?.payment?.type])

  // Raw payment data
  const paymentData: PaymentData = useMemo(
    () => ({
      cost,
      paymentType: finalPaymentType,
      runningTime,
      totalSpent: cost,
      startTime: instance?.time,
      blockchain: instance?.payment?.chain,
      loading,
    }),
    [
      cost,
      finalPaymentType,
      runningTime,
      instance?.time,
      instance?.payment?.chain,
      loading,
    ],
  )

  // Calculate if payment is pay-as-you-go
  const isPAYG = useMemo(() => {
    return paymentData.paymentType === PaymentType.superfluid
  }, [paymentData.paymentType])

  // Format total spent amount
  const totalSpent = useMemo(() => {
    if (!paymentData.cost) return 'N/A'
    if (!isPAYG) return paymentData.cost.toString()
    if (!paymentData.runningTime) return 'N/A'

    const runningTimeInHours = (paymentData.runningTime % (3600 * 24)) / 3600
    return (paymentData.cost * runningTimeInHours).toFixed(6)
  }, [paymentData.cost, isPAYG, paymentData.runningTime])

  // Format blockchain name
  const formattedBlockchain = useMemo(() => {
    if (!paymentData.blockchain) return 'N/A'
    return blockchains[paymentData.blockchain].name
  }, [paymentData.blockchain])

  // Format flow rate to show daily cost
  const formattedFlowRate = useMemo(() => {
    if (!isPAYG) return 'N/A'
    if (!paymentData.cost) return 'N/A'

    const dailyRate = paymentData.cost * 24
    return `~${dailyRate.toFixed(4)}/day`
  }, [paymentData.cost, isPAYG])

  // Format start date
  const formattedStartDate = useMemo(() => {
    if (!paymentData.startTime) return 'N/A'

    const date = new Date(paymentData.startTime * 1000)
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }, [paymentData.startTime])

  // Format duration display
  const formattedDuration = useMemo(() => {
    if (!paymentData.runningTime) return 'N/A'

    const days = Math.floor(paymentData.runningTime / (3600 * 24))
    const hours = Math.floor((paymentData.runningTime % (3600 * 24)) / 3600)
    const minutes = Math.floor((paymentData.runningTime % 3600) / 60)
    const secs = Math.floor(paymentData.runningTime % 60)

    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = secs.toString().padStart(2, '0')

    if (days > 0) {
      return `${days} ${days === 1 ? 'Day' : 'Days'} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    } else {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    }
  }, [paymentData.runningTime])

  // Return formatted data
  return {
    isPAYG,
    totalSpent,
    formattedBlockchain,
    formattedFlowRate,
    formattedStartDate,
    formattedDuration,
    loading: paymentData.loading,
  }
}
