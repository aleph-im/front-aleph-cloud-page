import React, { memo } from 'react'
import { Switch } from '@aleph-front/core'
import { SelectPaymentMethodProps } from './types'
import { useSelectPaymentMethod } from '@/hooks/form/useSelectPaymentMethod'
import { StyledLabel } from './styles'

export const SelectPaymentMethod = (props: SelectPaymentMethodProps) => {
  const {
    disabledHold,
    disabledStream,
    paymentMethodCtrl,
    handleClickHold,
    handleClickStream,
  } = useSelectPaymentMethod(props)

  return (
    <div tw="flex items-center justify-center gap-4" className="tp-body3">
      <StyledLabel
        {...{
          onClick: handleClickHold,
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
      />
      <StyledLabel
        {...{
          onClick: handleClickStream,
          $disabled: disabledStream,
        }}
      >
        Pay-as-you-go
      </StyledLabel>
    </div>
  )
}

export default memo(SelectPaymentMethod) as typeof SelectPaymentMethod
