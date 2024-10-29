import React, { memo } from 'react'
import { Switch } from '@aleph-front/core'
import { SelectPaymentMethodProps } from './types'
import { useSelectPaymentMethod } from '@/hooks/form/useSelectPaymentMethod'
import { StyledLabel } from './styles'
import { PaymentMethod } from '@/helpers/constants'
import ResponsiveTooltip from '@/components/common/ResponsiveTooltip'

export const SelectPaymentMethod = (props: SelectPaymentMethodProps) => {
  const {
    disabledHold,
    disabledStream,
    paymentMethodCtrl,
    disabledStreamTooltip,
    switchRef,
    handleClickHold,
    handleClickStream,
  } = useSelectPaymentMethod(props)

  return (
    <>
      <div
        tw="flex items-center justify-center gap-4"
        className="tp-body3"
        ref={switchRef}
      >
        <StyledLabel
          {...{
            onClick: handleClickHold,
            $selected: paymentMethodCtrl.field.value === PaymentMethod.Hold,
            $disabled: disabledHold,
          }}
        >
          Hold tokens
        </StyledLabel>
        <Switch
          {...{
            ...paymentMethodCtrl.field,
            ...paymentMethodCtrl.fieldState,
            disabled: disabledHold || disabledStream,
          }}
          ref={switchRef}
        />
        <StyledLabel
          {...{
            onClick: handleClickStream,
            $selected: paymentMethodCtrl.field.value === PaymentMethod.Stream,
            $disabled: disabledStream,
          }}
        >
          Pay-as-you-go
        </StyledLabel>
      </div>
      {disabledStream && (
        <ResponsiveTooltip
          my="bottom-left"
          at="top-left"
          targetRef={switchRef as React.RefObject<HTMLButtonElement>}
          content={disabledStreamTooltip}
        />
      )}
    </>
  )
}

export default memo(SelectPaymentMethod) as typeof SelectPaymentMethod
