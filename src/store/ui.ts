import { StoreReducer } from './store'

export type UIState = {
  isTopUpCreditsModalOpen: boolean
}

export const initialUIState: UIState = {
  isTopUpCreditsModalOpen: false,
}

export enum UIActionType {
  OPEN_TOP_UP_CREDITS_MODAL = 'OPEN_TOP_UP_CREDITS_MODAL',
  CLOSE_TOP_UP_CREDITS_MODAL = 'CLOSE_TOP_UP_CREDITS_MODAL',
}

export type OpenTopUpCreditsModalAction = {
  type: UIActionType.OPEN_TOP_UP_CREDITS_MODAL
  payload: undefined
}

export type CloseTopUpCreditsModalAction = {
  type: UIActionType.CLOSE_TOP_UP_CREDITS_MODAL
  payload: undefined
}

export type UIAction =
  | OpenTopUpCreditsModalAction
  | CloseTopUpCreditsModalAction

export type UIReducer = StoreReducer<UIState, UIAction>

export function getUIReducer(): UIReducer {
  return (state = initialUIState, action) => {
    switch (action.type) {
      case UIActionType.OPEN_TOP_UP_CREDITS_MODAL: {
        return {
          ...state,
          isTopUpCreditsModalOpen: true,
        }
      }

      case UIActionType.CLOSE_TOP_UP_CREDITS_MODAL: {
        return {
          ...state,
          isTopUpCreditsModalOpen: false,
        }
      }

      default: {
        return state
      }
    }
  }
}

// Action creators
export function openTopUpCreditsModal(): OpenTopUpCreditsModalAction {
  return {
    type: UIActionType.OPEN_TOP_UP_CREDITS_MODAL,
    payload: undefined,
  }
}

export function closeTopUpCreditsModal(): CloseTopUpCreditsModalAction {
  return {
    type: UIActionType.CLOSE_TOP_UP_CREDITS_MODAL,
    payload: undefined,
  }
}
