import React, { cloneElement, isValidElement, memo } from 'react'
import { Button, ButtonProps } from '@aleph-front/core'
import { StyledSeparator } from './styles'
import { CheckoutSummaryFooterProps } from './types'
import FloatingFooter from '../FloatingFooter'
import Price from '@/components/common/Price'
import { humanReadableCurrency } from '@/helpers/utils'
import { useCreditToToken } from './useCreditToToken'
import Skeleton from '@/components/common/Skeleton'

// ------------------------------------------

export const CheckoutSummaryFooter = ({
  submitButton: submitButtonNode,
  mainRef: containerRef,
  totalCost,
  loading = false,
  shouldHide = true,
  thresholdOffset = 600,
  ...rest
}: CheckoutSummaryFooterProps) => {
  const footerSubmitButtonNode =
    submitButtonNode &&
    (isValidElement(submitButtonNode) && submitButtonNode.type === Button
      ? cloneElement(submitButtonNode, { size: 'md' } as ButtonProps)
      : submitButtonNode)

  const { tokenAmount, isLoading: isLoadingConversion } =
    useCreditToToken(totalCost)

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
          <div tw="py-2 flex flex-col md:flex-row gap-6 items-center justify-end flex-wrap">
            <div tw="flex flex-col md:flex-row gap-4">
              <div>
                <div tw="flex items-center justify-center gap-2 whitespace-nowrap">
                  <span className="text-main0 fs-24 tp-body3">
                    <Price type="credit" value={totalCost} loading={loading} />
                  </span>
                  <span className="tp-body2" tw="mt-1">
                    Credits / h
                  </span>
                </div>
                <div
                  className="fs-14"
                  tw="flex items-center justify-center md:justify-start whitespace-nowrap opacity-40 -mt-2"
                >
                  {isLoadingConversion || tokenAmount === null ? (
                    <Skeleton width="4rem" />
                  ) : (
                    <span>${humanReadableCurrency(tokenAmount)}/ h</span>
                  )}
                </div>
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
