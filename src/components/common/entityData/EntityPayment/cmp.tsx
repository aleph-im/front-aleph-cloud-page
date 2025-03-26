import React, { memo } from 'react'
import { Logo, NoisyContainer } from '@aleph-front/core'
import { EntityPaymentProps } from './types'
import { Text } from '@/components/pages/dashboard/common'
import { useEntityPayment } from './hook'

/**
 * Component to display payment information
 * Takes raw data as props and uses the hook for formatting
 */
export const EntityPayment = (props: EntityPaymentProps) => {
  const {
    isPAYG,
    totalSpent,
    formattedBlockchain,
    formattedFlowRate,
    formattedStartDate,
    formattedDuration,
    loading,
  } = useEntityPayment(props)

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
