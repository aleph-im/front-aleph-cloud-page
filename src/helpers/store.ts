import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import {
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/message'
import { AccountFilesResponse } from './aleph'
import { SSHKey } from './ssh'

export enum ActionTypes {
  connect,
  disconnect,
  setAccountBalance,
  setProducts,
  setAccountFiles,
  setAccountSSHKeys,
  addAccountSSHKey,
}

export type State = {
  account?: Account
  accountBalance?: number
  products: {
    instances?: ProgramMessage[]
    functions?: ProgramMessage[]
    volumes?: StoreMessage[]
  }
  accountFiles?: AccountFilesResponse
  accountSSHKeys?: any
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
  accountFiles: undefined,
  accountSSHKeys: undefined,
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

    case ActionTypes.setAccountFiles:
      return {
        ...state,
        accountFiles: payload.accountFiles,
      }

    case ActionTypes.setAccountSSHKeys:
      return {
        ...state,
        accountSSHKeys: payload.accountSSHKeys,
      }

    case ActionTypes.addAccountSSHKey:
      const keys = (state.accountSSHKeys || []) as SSHKey[]

      const map = new Map(keys.map((key) => [key.id, key]))
      map.set(payload.accountSSHKey.id, payload.accountSSHKey)
      const accountSSHKeys = Array.from(map.values())

      return {
        ...state,
        accountSSHKeys,
      }

    default:
      return state
  }
}
