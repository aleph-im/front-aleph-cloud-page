import ButtonWithInfoTooltip from '@/components/common/ButtonWithInfoTooltip'
import React, { useRef } from 'react'
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
  }: CheckoutButtonProps) => {
    const checkoutButtonRef = useRef<HTMLButtonElement>(null)

    return (
      <ButtonWithInfoTooltip
        ref={checkoutButtonRef}
        type={shouldRequestTermsAndConditions ? 'button' : 'submit'}
        color="main0"
        kind="default"
        size="lg"
        variant="primary"
        disabled={disabled}
        tooltipContent={tooltipContent}
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
