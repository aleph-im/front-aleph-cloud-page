import { PaymentMethod } from '@/helpers/constants'
import { ChangeEvent, useCallback, useRef } from 'react'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type UseSelectPaymentMethodProps = {
  name?: string
  control: Control
  defaultValue?: PaymentMethod
  disabledHold?: boolean
  disabledStream?: boolean
  disabledStreamTooltip: React.ReactNode
  onSwitch?: (e: PaymentMethod) => void
}

export type UseSelectPaymentMethodReturn = {
  disabledHold?: boolean
  disabledStream?: boolean
  paymentMethodCtrl: UseControllerReturn<any, any>
  disabledStreamTooltip: React.ReactNode
  switchRef: React.Ref<HTMLInputElement>
  selectedPaymentMethod: PaymentMethod
  handleClickStream: () => void
  handleClickHold: () => void
}

export function useSelectPaymentMethod({
  name = 'paymentMethod',
  control,
  defaultValue,
  disabledHold,
  disabledStream,
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

  const selectedPaymentMethod = paymentMethodCtrl.field.value

  const handleClickStream = useCallback(() => {
    if (disabledStream) return
    if (selectedPaymentMethod === PaymentMethod.Stream) return

    onChange(PaymentMethod.Stream)
  }, [disabledStream, onChange, selectedPaymentMethod])

  const handleClickHold = useCallback(() => {
    if (disabledHold) return
    if (selectedPaymentMethod === PaymentMethod.Hold) return

    onChange(PaymentMethod.Hold)
  }, [disabledHold, onChange, selectedPaymentMethod])

  const switchRef = useRef<HTMLInputElement>(null)

  return {
    paymentMethodCtrl,
    selectedPaymentMethod,
    disabledHold,
    disabledStream,
    switchRef,
    handleClickStream,
    handleClickHold,
    ...rest,
  }
}
