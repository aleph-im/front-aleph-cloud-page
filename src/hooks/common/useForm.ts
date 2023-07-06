import { FormEvent, useCallback, useReducer } from 'react'
import { RequestState, useRequestState } from './useRequestState'

export type UseFormProps<FormState, Response = void> = {
  initialState: FormState
  onSubmit: (state: FormState) => Promise<Response>
}

export type UseFormReturn<FormState, Response = void> = {
  state: FormState
  requestState: RequestState<Response>
  setFormValue: (field: keyof FormState, value: unknown) => void
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useForm<FormState, Response>({
  initialState,
  onSubmit,
}: UseFormProps<FormState, Response>): UseFormReturn<FormState, Response> {
  const [state, dispatchState] = useReducer(
    (
      state: FormState,
      action: {
        type: string
        payload: { key: keyof FormState; value: unknown }
      },
    ): FormState => {
      switch (action.type) {
        case 'SET_VALUE':
          return {
            ...state,
            [action.payload.key]: action.payload.value,
          }

        default:
          return state
      }
    },
    initialState,
  )

  const [requestState, { onLoad, onSuccess, onError }] =
    useRequestState<Response>()

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      try {
        onLoad()
        const response = await onSubmit(state)
        onSuccess(response)
      } catch (e) {
        onError(e as Error)
      }
    },
    [state, onError, onLoad, onSubmit, onSuccess],
  )

  const setFormValue = useCallback(
    (key: keyof FormState, value: unknown) =>
      dispatchState({ type: 'SET_VALUE', payload: { key, value } }),
    [],
  )

  return {
    state,
    requestState,
    handleSubmit,
    setFormValue,
  }
}
