import { PaymentMethod } from '@/helpers/constants'
import { ChangeEvent, useCallback } from 'react'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type UseSelectPaymentMethodProps = {
  name?: string
  control: Control
  defaultValue?: PaymentMethod
  disabledHold?: boolean
  disabledStream?: boolean
  onSwitch?: (e: PaymentMethod) => void
}

export type UseSelectPaymentMethodReturn = {
  disabledHold?: boolean
  disabledStream?: boolean
  paymentMethodCtrl: UseControllerReturn<any, any>
  handleClickStream: () => void
  handleClickHold: () => void
}

export function useSelectPaymentMethod({
  name = 'paymentMethod',
  control,
  defaultValue,
  disabledHold,
  onSwitch,
  ...rest
}: UseSelectPaymentMethodProps): UseSelectPaymentMethodReturn {
  const paymentMethodCtrl = useController({
    control,
    name,
    defaultValue,
  })

  const onChange = onSwitch || paymentMethodCtrl.field.onChange

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const checked = e.currentTarget.checked
      onChange(checked ? PaymentMethod.Stream : PaymentMethod.Hold)
    },
    [onChange],
  )

  paymentMethodCtrl.field.onChange = handleChange
  ;(paymentMethodCtrl.field as any).checked =
    paymentMethodCtrl.field.value === PaymentMethod.Stream

  const handleClickStream = useCallback(() => {
    onChange(PaymentMethod.Stream)
  }, [onChange])

  const handleClickHold = useCallback(() => {
    if (disabledHold) return
    onChange(PaymentMethod.Hold)
  }, [disabledHold, onChange])

  return {
    paymentMethodCtrl,
    handleClickStream,
    handleClickHold,
    disabledHold,
    ...rest,
  }
}
