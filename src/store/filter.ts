import { StoreReducer } from './store'

export type FilterItem = {
  key: string
  value: string
}

export type FilterState = Record<string, FilterItem | null>

export const initialState: FilterState = {}

export enum FilterActionType {
  FILTER_SET = 'FILTER_SET',
  FILTER_ADD = 'FILTER_ADD',
  FILTER_DEL = 'FILTER_DEL',
}

export class FilterSetAction {
  readonly type = FilterActionType.FILTER_SET
  constructor(public payload: { state: FilterState }) {}
}

export class FilterAddAction {
  readonly type = FilterActionType.FILTER_ADD
  constructor(public payload: { key: string; value: string }) {}
}

export class FilterDelAction {
  readonly type = FilterActionType.FILTER_DEL
  constructor(public payload: { key: string }) {}
}

export type FilterAction = FilterSetAction | FilterAddAction | FilterDelAction

export type FilterReducer = StoreReducer<FilterState, FilterAction>

export function getFilterReducer(): FilterReducer {
  return (state = initialState, action) => {
    switch (action.type) {
      case FilterActionType.FILTER_SET: {
        const { state } = action.payload

        return state
      }

      case FilterActionType.FILTER_ADD: {
        const { key } = action.payload

        const newState = {
          ...state,
          [key]: action.payload,
        }

        return newState
      }

      case FilterActionType.FILTER_DEL: {
        const { key } = action.payload

        const newState = {
          ...state,
          [key]: null,
        }

        return newState
      }

      default: {
        return state
      }
    }
  }
}
