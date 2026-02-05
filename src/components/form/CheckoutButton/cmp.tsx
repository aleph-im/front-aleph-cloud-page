import ButtonWithInfoTooltip from '@/components/common/ButtonWithInfoTooltip'
import { formatCredits } from '@/helpers/utils'
import { Button, Icon } from '@aleph-front/core'
import React, { useMemo, useRef } from 'react'
import { CheckoutButtonProps } from './types'

const CheckoutButton = React.memo(
  ({
    disabled,
    title,
    tooltipContent,
    isFooter,
    shouldRequestTermsAndConditions,
    handleRequestTermsAndConditionsAgreement,
    handleSubmit,
    insufficientFunds,
  }: CheckoutButtonProps) => {
    const checkoutButtonRef = useRef<HTMLButtonElement>(null)

    const finalTooltipContent = useMemo(() => {
      if (insufficientFunds) {
        return (
          <div tw="text-left">
            <p className="tp-body1 fs-14">
              Min.{' '}
              <strong>
                {formatCredits(insufficientFunds.minimumBalanceNeeded)}
              </strong>{' '}
              required
            </p>
            <Button
              type="button"
              kind="default"
              variant="textOnly"
              size="sm"
              color="main0"
              onClick={(e) => {
                e.stopPropagation()
                insufficientFunds.onTopUpClick()
              }}
              tw="mt-1 p-0!"
            >
              Top up
              <Icon name="arrow-right" tw="ml-2" />
            </Button>
          </div>
        )
      }
      return tooltipContent
    }, [insufficientFunds, tooltipContent])

    return (
      <ButtonWithInfoTooltip
        ref={checkoutButtonRef}
        type={shouldRequestTermsAndConditions ? 'button' : 'submit'}
        color="main0"
        kind="default"
        size="lg"
        variant="primary"
        disabled={disabled}
        tooltipContent={finalTooltipContent}
        tooltipPosition={{
          my: isFooter ? 'bottom-right' : 'bottom-center',
          at: isFooter ? 'top-right' : 'top-center',
        }}
        onClick={
          shouldRequestTermsAndConditions
            ? handleRequestTermsAndConditionsAgreement
            : handleSubmit
        }
      >
        {title}
      </ButtonWithInfoTooltip>
    )
  },
)

export default CheckoutButton
CheckoutButton.displayName = 'CheckoutButton'
