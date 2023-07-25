import { FormEvent, useCallback, useMemo } from 'react'
import { RequestState, useRequestState } from './useRequestState'
import {
  useForm as useFormLib,
  UseFormReturn as UseFormReturnLib,
  UseFormProps as UseFormPropsLib,
  FieldErrors,
} from 'react-hook-form'

export type UseFormProps<
  FormState extends Record<string, any>,
  Response = void,
> = UseFormPropsLib<FormState> & {
  onSubmit: (state: FormState) => Promise<Response>
}

export type UseFormReturn<
  FormState extends Record<string, any>,
  Response = void,
> = Omit<UseFormReturnLib<FormState>, 'handleSubmit'> & {
  requestState: RequestState<Response>
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useForm<FormState extends Record<string, any>, Response>({
  onSubmit,
  ...props
}: UseFormProps<FormState, Response>): UseFormReturn<FormState, Response> {
  const form = useFormLib<FormState>(props)

  const [requestState, { onLoad, onSuccess, onError }] =
    useRequestState<Response>()

  const handleSubmitRequest = useCallback(
    async (state: FormState) => {
      try {
        onLoad()
        const response = await onSubmit(state)
        onSuccess(response)
      } catch (e) {
        const err = e as Error
        form.setError('root', { message: err.message })
        onError(e as Error)
      }
    },
    [form, onError, onLoad, onSubmit, onSuccess],
  )

  const handleValidationError = useCallback(
    async (errors: FieldErrors<FormState>) => {
      const [firstError] = Object.values(errors)

      const error = new Error(
        errors.root?.message ||
          (firstError?.message as string) ||
          'Validation error',
      )

      console.log(errors)

      onError(error)
    },
    [onError],
  )

  const handleSubmit = useMemo(
    () => form.handleSubmit(handleSubmitRequest, handleValidationError),
    [form, handleSubmitRequest, handleValidationError],
  )

  return {
    ...form,
    requestState,
    handleSubmit,
  }
}
