import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import {
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/message'

export enum ActionTypes {
  connect,
  disconnect,
  setAccountBalance,
  setProducts,
}

export type State = {
  account?: Account
  accountBalance?: number
  products: {
    instances?: ProgramMessage[]
    functions?: ProgramMessage[]
    volumes?: StoreMessage[]
  }
}

export type Action = {
  type: ActionTypes
  payload: any
}

export const initialState: State = {
  account: undefined,
  accountBalance: undefined,
  products: {
    instances: undefined,
    functions: undefined,
    volumes: undefined,
  },
}

export const reducer = (
  state: State = initialState,
  { type, payload }: Action,
) => {
  switch (type) {
    case ActionTypes.connect:
      return {
        ...state,
        account: payload.account,
      }

    case ActionTypes.disconnect:
      return {
        ...state,
        account: undefined,
      }

    case ActionTypes.setAccountBalance:
      return {
        ...state,
        accountBalance: payload.balance,
      }

    case ActionTypes.setProducts:
      return {
        ...state,
        products: payload.products,
      }

    default:
      return state
  }
}
