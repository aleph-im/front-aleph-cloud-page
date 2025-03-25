import React, { memo, useMemo } from 'react'
import { Logo, NoisyContainer } from '@aleph-front/core'
import { EntityPaymentProps } from './types'
import { Text } from '@/components/pages/dashboard/common'
import { blockchains } from '@/domain/connect/base'
import { PaymentType } from '@aleph-sdk/message'
import { useEntityPayment } from './hook'

export const EntityPayment = ({
  instance,
  paymentType,
}: EntityPaymentProps) => {
  const {
    cost,
    paymentType: finalPaymentType,
    runningTime,
    startTime,
    blockchain,
    loading,
  } = useEntityPayment({ instance, paymentType })

  const isPAYG = useMemo(
    () => finalPaymentType === PaymentType.superfluid,
    [finalPaymentType],
  )

  // Use the appropriate cost value based on payment type
  const totalSpent = useMemo(() => {
    if (!cost) return 'N/A'
    if (!isPAYG) return cost
    if (!runningTime) return 'N/A'

    const runningTimeInHours = (runningTime % (3600 * 24)) / 3600
    return (cost * runningTimeInHours).toFixed(6)
  }, [cost, isPAYG, runningTime])

  // Format Blockchain name
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

  // Format start date in the required format
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

  // Helper function to format time duration for display in detailed format
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

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        PAYMENT
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-4 p-4">
          {/* Top row with ALEPH token box and total cost */}
          <div tw="flex items-center gap-4">
            <div
              className="bg-main0 text-base0"
              tw="flex items-center gap-1 px-3 py-1"
            >
              <Logo img="aleph" color="base0" byAleph={false} />
              <div tw="uppercase font-bold leading-relaxed">ALEPH</div>
            </div>
            <p className="text-base2 fs-18" tw="font-bold">
              {loading ? 'Loading...' : totalSpent}
            </p>
          </div>

          {/* Payment type row */}
          <div tw="flex flex-wrap gap-6">
            <div>
              <div className="tp-info text-main0 fs-12">TYPE</div>
              <Text>{isPAYG ? 'Pay as you go' : 'Holding'}</Text>
            </div>
            <div>
              <div className="tp-info text-main0 fs-12">BLOCKCHAIN</div>
              <Text>{formattedBlockchain}</Text>
            </div>
          </div>

          {/* Start date, flow rate, and time elapsed */}
          <div tw="flex flex-wrap gap-6">
            <div>
              <div className="tp-info text-main0 fs-12">START DATE</div>
              <Text>{formattedStartDate}</Text>
            </div>

            {isPAYG && (
              <>
                <div>
                  <div className="tp-info text-main0 fs-12">FLOW RATE</div>
                  <Text>{formattedFlowRate}</Text>
                </div>
                <div>
                  <div className="tp-info text-main0 fs-12">TIME ELAPSED</div>
                  <Text>{formattedDuration}</Text>
                </div>
              </>
            )}
          </div>
        </div>
      </NoisyContainer>
    </>
  )
}
EntityPayment.displayName = 'EntityPayment'

export default memo(EntityPayment) as typeof EntityPayment
