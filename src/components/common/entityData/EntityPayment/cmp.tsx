import React, { memo } from 'react'
import { Logo, NoisyContainer } from '@aleph-front/core'
import { EntityPaymentProps, PaymentData } from './types'
import { Text } from '@/components/pages/dashboard/common'
import { useFormatPayment } from './hook'
import Skeleton from '../../Skeleton'
import { PaymentType } from '@aleph-sdk/message'

/**
 * Individual payment card component
 * Used to render the main payment or individual stream payments
 */
const PaymentCard = ({ paymentData }: { paymentData: PaymentData }) => {
  const {
    isPAYG,
    totalSpent,
    formattedBlockchain,
    formattedFlowRate,
    formattedStartDate,
    formattedDuration,
    loading,
    receiverType,
  } = useFormatPayment(paymentData)

  return (
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
            {totalSpent ? totalSpent : <Skeleton width="5rem" />}
          </p>
        </div>

        {/* Payment type row */}
        <div tw="flex flex-wrap gap-6">
          <div>
            <div className="tp-info text-main0 fs-12">TYPE</div>
            <Text>
              {loading ? (
                <Skeleton width="5rem" />
              ) : isPAYG ? (
                'Pay as you go'
              ) : (
                'Holding'
              )}
            </Text>
          </div>
          <div>
            <div className="tp-info text-main0 fs-12">BLOCKCHAIN</div>
            <Text>
              {formattedBlockchain ? (
                formattedBlockchain
              ) : (
                <Skeleton width="3rem" />
              )}
            </Text>
          </div>
          {receiverType && (
            <div>
              <div className="tp-info text-main0 fs-12">RECEIVER</div>
              <Text>{receiverType}</Text>
            </div>
          )}
        </div>

        {/* Start date, flow rate, and time elapsed */}
        <div tw="flex flex-wrap gap-6">
          <div>
            <div className="tp-info text-main0 fs-12">START DATE</div>
            <Text>
              {formattedStartDate ? (
                formattedStartDate
              ) : (
                <Skeleton width="8rem" />
              )}
            </Text>
          </div>

          {isPAYG && (
            <>
              <div>
                <div className="tp-info text-main0 fs-12">FLOW RATE</div>
                <Text>
                  {formattedFlowRate ? (
                    formattedFlowRate
                  ) : (
                    <Skeleton width="5rem" />
                  )}
                </Text>
              </div>
              <div>
                <div className="tp-info text-main0 fs-12">TIME ELAPSED</div>
                <Text>
                  {formattedDuration ? (
                    formattedDuration
                  ) : (
                    <Skeleton width="4rem" />
                  )}
                </Text>
              </div>
            </>
          )}
        </div>
      </div>
    </NoisyContainer>
  )
}

/**
 * Component to display payment information
 * Takes an array of payment data objects and renders a card for each one
 */
export const EntityPayment = ({ payments }: EntityPaymentProps) => {
  if (!payments || payments.length === 0) {
    return null
  }

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        PAYMENT
      </div>

      <div tw="flex flex-col gap-4">
        {payments.map((paymentData, index) => (
          <PaymentCard
            key={`payment-${index}-${paymentData.paymentType}`}
            paymentData={paymentData}
          />
        ))}
      </div>
    </>
  )
}

EntityPayment.displayName = 'EntityPayment'

export default memo(EntityPayment) as typeof EntityPayment
