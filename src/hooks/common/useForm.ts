import { FormEvent, useCallback, useMemo } from 'react'
import { RequestState, useRequestState } from './useRequestState'
import {
  useForm as useFormLib,
  UseFormReturn as UseFormReturnLib,
  UseFormProps as UseFormPropsLib,
  FieldErrors,
  FieldValues,
} from 'react-hook-form'
import { ZodError } from 'zod'

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

function getFirstError<T extends FieldValues>(
  errors: FieldErrors<T>,
): [string, any] | undefined {
  const [firstError] = Object.entries(errors)
  if (!firstError) return

  const [field, err] = firstError

  if (Array.isArray(err)) {
    const subError = err[err.length - 1]
    return getFirstError(subError)
  }

  return [field, err]
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
        const error =
          err instanceof ZodError
            ? new Error('Validation error, check highlighted form fields')
            : ((err?.cause || err) as Error)

        // @note: form.setError is cloning the error obj loosing the message prop
        form.setError('root.serverError', {
          ...error,
          message: error?.message,
        })

        onError(error)
      }
    },
    [form, onError, onLoad, onSubmit, onSuccess],
  )

  const handleValidationError = useCallback(
    async (errors: FieldErrors<FormState>) => {
      console.log(errors)

      let error: Error | undefined

      if (!error) {
        const firstError = getFirstError(errors)

        if (firstError) {
          const [field, err] = firstError

          const description =
            typeof err === 'string'
              ? err
              : err?.message
              ? `: ${err.message}`
              : err?.type
              ? `: "${err?.type}" validation not satisfied`
              : ''

          error = new Error(`Error on field "${field}"${description}`)
        }
      }

      if (!error) {
        error = new Error('Validation error')
      }

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
