import { useEffect, useRef } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { PaymentMethod } from '@/helpers/constants'
import { usePaymentMethod } from './usePaymentMethod'

export type UseSyncPaymentMethodProps = {
  /**
   * Current payment method value from the form
   */
  formPaymentMethod: PaymentMethod
  /**
   * Form setValue function to update the form value
   */
  setValue: UseFormSetValue<any>
  /**
   * Field name in the form (defaults to 'paymentMethod')
   */
  fieldName?: string
}

/**
 * Hook to synchronize the global payment method state with form state
 * It handles both directions:
 * - Updates the form when global state changes
 * - Updates the global state when form value changes
 */
export function useSyncPaymentMethod({
  formPaymentMethod,
  setValue,
  fieldName = 'paymentMethod',
}: UseSyncPaymentMethodProps): void {
  const { paymentMethod: globalPaymentMethod, setPaymentMethod } =
    usePaymentMethod()

  // Using a ref to track if we initiated the change to prevent loops
  const isUpdatingRef = useRef<boolean>(false)

  // Update global state when form changes
  useEffect(() => {
    if (isUpdatingRef.current) return
    isUpdatingRef.current = true

    console.log('Update global state when form changes', formPaymentMethod)
    setPaymentMethod(formPaymentMethod)

    setTimeout(() => (isUpdatingRef.current = false), 0)
  }, [formPaymentMethod, setPaymentMethod])

  // Update form when global state changes
  useEffect(() => {
    if (isUpdatingRef.current) return

    console.log('Update form when global state changes', globalPaymentMethod)
    setValue(fieldName, globalPaymentMethod)
  }, [fieldName, globalPaymentMethod, setValue])
}
