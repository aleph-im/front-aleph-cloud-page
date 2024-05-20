import { StoreReducer } from './store'

export type RequestState<T> = {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

export const initialState: RequestState<never> = {
  data: undefined,
  loading: true,
  error: undefined,
}

export enum RequestActionType {
  REQUEST_SET = 'REQUEST_SET',
  REQUEST_START = 'REQUEST_START',
  REQUEST_SUCCESS = 'REQUEST_SUCCESS',
  REQUEST_ERROR = 'REQUEST_ERROR',
}

export class RequestSetAction<T> {
  readonly type = RequestActionType.REQUEST_SET
  constructor(public payload: { name: string; state: RequestState<T> }) {}
}

export class RequestStartAction {
  readonly type = RequestActionType.REQUEST_START
  constructor(public payload: { name: string; flushData?: boolean }) {}
}

export class RequestSuccessAction<T> {
  readonly type = RequestActionType.REQUEST_SUCCESS
  constructor(public payload: { name: string; data: T }) {}
}

export class RequestErrorAction {
  readonly type = RequestActionType.REQUEST_ERROR
  constructor(
    public payload: { name: string; error: Error; flushData?: boolean },
  ) {}
}

export type RequestAction<T> =
  | RequestSetAction<T>
  | RequestStartAction
  | RequestSuccessAction<T>
  | RequestErrorAction

export type RequestReducer<T> = StoreReducer<RequestState<T>, RequestAction<T>>

export function getRequestReducer<E>(name: string): RequestReducer<E> {
  return (state = initialState, action) => {
    if (action.payload?.name !== name) return state

    switch (action.type) {
      case RequestActionType.REQUEST_SET: {
        return { ...state, ...action.payload.state }
      }

      case RequestActionType.REQUEST_START: {
        const { flushData } = action.payload || {}

        return {
          ...state,
          loading: true,
          error: undefined,
          data: flushData ? undefined : state.data,
        }
      }

      case RequestActionType.REQUEST_SUCCESS: {
        const { data } = action.payload

        return {
          ...state,
          loading: false,
          error: undefined,
          data,
        }
      }

      case RequestActionType.REQUEST_ERROR: {
        const { error, flushData } = action.payload

        return {
          ...state,
          loading: false,
          error,
          data: flushData ? undefined : state.data,
        }
      }

      default: {
        return state
      }
    }
  }
}
