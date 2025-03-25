import { useEffect, useState } from 'react'
import { PaymentType } from '@aleph-sdk/message'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { EntityPaymentProps, UseEntityPaymentReturn } from './types'

export function useEntityPayment({
  instance,
  paymentType,
}: EntityPaymentProps): UseEntityPaymentReturn {
  const [cost, setCost] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)
  const instanceManager = useInstanceManager()

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
  const runningTime = instance?.time
    ? Math.floor(Date.now() - instance.time * 1000) / 1000
    : undefined

  // Final payment type, either from props or instance
  const finalPaymentType =
    paymentType || instance?.payment?.type || PaymentType.hold

  return {
    cost,
    paymentType: finalPaymentType,
    runningTime,
    totalSpent: cost,
    startTime: instance?.time,
    blockchain: instance?.payment?.chain,
    loading,
  }
}
