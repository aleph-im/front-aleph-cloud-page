import React, { memo } from 'react'
import { Logo, NoisyContainer } from '@aleph-front/core'
import { EntityPaymentProps, PaymentData } from './types'
import { Text } from '@/components/pages/console/common'
import { useFormatPayment } from './hook'
import Skeleton from '../../Skeleton'
import IconText from '../../IconText'
import { ellipseAddress } from '@/helpers/utils'
import InfoTitle from '../InfoTitle'

/**
 * Individual payment card component
 * Used to render the main payment or individual stream payments
 */
const PaymentCard = ({ paymentData }: { paymentData: PaymentData }) => {
  const {
    isStream,
    totalSpent,
    formattedBlockchain,
    formattedFlowRate,
    formattedStartDate,
    formattedDuration,
    loading,
    receiverAddress,
    receiverType,
    handleCopyReceiverAddress,
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
        <div tw="flex flex-wrap gap-x-6 gap-y-4">
          <div>
            <InfoTitle>TYPE</InfoTitle>
            <Text>
              {loading ? (
                <Skeleton width="5rem" />
              ) : isStream ? (
                'Stream'
              ) : (
                'Holding'
              )}
            </Text>
          </div>
          <div>
            <InfoTitle>BLOCKCHAIN</InfoTitle>
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
              <InfoTitle>RECEIVER</InfoTitle>
              <Text>{receiverType}</Text>
            </div>
          )}
          {receiverAddress && (
            <div>
              <InfoTitle>RECEIVER ADDRESS</InfoTitle>
              <IconText iconName="copy" onClick={handleCopyReceiverAddress}>
                {ellipseAddress(receiverAddress)}
              </IconText>
            </div>
          )}
        </div>

        {/* Start date, flow rate, and time elapsed */}
        <div tw="flex flex-wrap gap-x-6 gap-y-4">
          <div>
            <InfoTitle>START DATE</InfoTitle>
            <Text>
              {formattedStartDate ? (
                formattedStartDate
              ) : (
                <Skeleton width="8rem" />
              )}
            </Text>
          </div>

          {isStream && (
            <>
              <div>
                <InfoTitle>FLOW RATE</InfoTitle>
                <Text>
                  {formattedFlowRate ? (
                    formattedFlowRate
                  ) : (
                    <Skeleton width="5rem" />
                  )}
                </Text>
              </div>
              <div>
                <InfoTitle>TIME ELAPSED</InfoTitle>
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
