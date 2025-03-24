import React, { memo } from 'react'
import { Icon, Logo, NoisyContainer } from '@aleph-front/core'
import { EntityPaymentProps } from './types'
import Price from '@/components/common/Price'
import { Text } from '@/components/pages/dashboard/common'

// Helper function to format time duration for display in detailed format
const formatDetailedDuration = (seconds?: number): string => {
  if (!seconds) return 'N/A'

  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const formattedHours = hours.toString().padStart(2, '0')
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = secs.toString().padStart(2, '0')

  if (days > 0) {
    return `${days} ${days === 1 ? 'Day' : 'Days'} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  } else {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }
}

// Format start date in the required format
const formatStartDate = (timestamp?: number): string => {
  if (!timestamp) return 'N/A'

  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

// Format flow rate to show daily cost
const formatFlowRate = (hourlyRate?: number): string => {
  if (!hourlyRate) return 'N/A'

  const dailyRate = hourlyRate * 24
  return `~ ${dailyRate.toFixed(4)}/day`
}

export const EntityPayment = ({
  cost,
  paymentType = 'holding',
  costPerHour,
  runningTime,
  totalSpent,
  startTime,
}: EntityPaymentProps) => {
  // Use the appropriate cost value based on payment type
  const displayCost = paymentType === 'holding' ? cost : totalSpent?.toFixed(6)

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
              {displayCost ? displayCost : 'N/A'}
            </p>
          </div>

          {/* Payment type row */}
          <div>
            <div className="tp-info text-main0 fs-12">TYPE</div>
            <Text>
              {paymentType === 'holding' ? 'Holding' : 'Pay as you go'}
            </Text>
          </div>

          {/* Start date, flow rate, and time elapsed */}
          <div tw="flex flex-wrap gap-6">
            <div>
              <div className="tp-info text-main0 fs-12">START DATE</div>
              <Text>{formatStartDate(startTime)}</Text>
            </div>

            {paymentType === 'stream' && (
              <>
                <div>
                  <div className="tp-info text-main0 fs-12">FLOW RATE</div>
                  <Text>{formatFlowRate(costPerHour)}</Text>
                </div>
                <div>
                  <div className="tp-info text-main0 fs-12">TIME ELAPSED</div>
                  <Text>{formatDetailedDuration(runningTime)}</Text>
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
