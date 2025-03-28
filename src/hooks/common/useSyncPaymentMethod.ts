import { useEffect } from 'react'
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

  // Update form when global state changes
  useEffect(() => {
    if (formPaymentMethod !== globalPaymentMethod) {
      setValue(fieldName, globalPaymentMethod)
    }
  }, [globalPaymentMethod, setValue, formPaymentMethod, fieldName])

  // Update global state when form changes
  useEffect(() => {
    if (globalPaymentMethod !== formPaymentMethod) {
      setPaymentMethod(formPaymentMethod)
    }
  }, [formPaymentMethod, globalPaymentMethod, setPaymentMethod])
}
