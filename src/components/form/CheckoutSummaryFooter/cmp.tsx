import React, { cloneElement, isValidElement, memo } from 'react'
import { Button, ButtonProps } from '@aleph-front/core'
import { StyledSeparator } from './styles'
import { CheckoutSummaryFooterProps } from './types'
import { PaymentMethod } from '@/helpers/constants'
import Price from '@/components/common/Price'
import FloatingFooter from '../FloatingFooter'

// ------------------------------------------

export const CheckoutSummaryFooter = ({
  submitButton: submitButtonNode,
  paymentMethodSwitch: paymentMethodSwitchNode,
  paymentMethod,
  mainRef: containerRef,
  totalCost,
  shouldHide = true,
  thresholdOffset = 600,
  ...rest
}: CheckoutSummaryFooterProps) => {
  const footerSubmitButtonNode =
    submitButtonNode &&
    (isValidElement(submitButtonNode) && submitButtonNode.type === Button
      ? cloneElement(submitButtonNode, { size: 'md' } as ButtonProps)
      : submitButtonNode)

  return (
    <>
      {containerRef && (
        <FloatingFooter
          {...{
            containerRef,
            shouldHide,
            thresholdOffset,
            ...rest,
          }}
        >
          <div tw="py-2 flex flex-col md:flex-row gap-6 items-center justify-between flex-wrap">
            <div>{paymentMethodSwitchNode}</div>
            <div tw="flex flex-col md:flex-row gap-4">
              <div
                className="tp-body2"
                tw="flex items-center justify-center gap-4 whitespace-nowrap"
              >
                <span tw="mt-1">
                  {paymentMethod === PaymentMethod.Stream
                    ? 'Total per hour'
                    : 'Total hold'}
                </span>
                <Price
                  value={totalCost}
                  className="text-main0 fs-24 tp-body3"
                />
              </div>
              <StyledSeparator />
              {footerSubmitButtonNode}
            </div>
          </div>
        </FloatingFooter>
      )}
    </>
  )
}

export default memo(CheckoutSummaryFooter) as typeof CheckoutSummaryFooter
