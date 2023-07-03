import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { ProgramMessage, StoreMessage } from 'aleph-sdk-ts/dist/messages/types'
import { AccountFilesResponse } from './aleph'
import { SSHKey } from './ssh'
import { Instance } from './instance'

export enum ActionTypes {
  connect,
  disconnect,
  setAccountBalance,
  setAccountFiles,
  setAccountSSHKeys,
  addAccountSSHKey,
  setAccountFunctions,
  setAccountVolumes,
  setAccountInstances,
}

export type State = {
  account?: Account
  accountBalance?: number
  accountInstances?: Instance[]
  accountFunctions?: ProgramMessage[]
  accountVolumes?: StoreMessage[]
  accountFiles?: AccountFilesResponse
  accountSSHKeys?: SSHKey[]
}

export type Action = {
  type: ActionTypes
  payload: any
}

export const initialState: State = {
  account: undefined,
  accountBalance: undefined,
  accountInstances: undefined,
  accountFunctions: undefined,
  accountVolumes: undefined,
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

    case ActionTypes.setAccountFunctions:
      const { accountFunctions } = payload
      return {
        ...state,
        accountFunctions,
      }

    case ActionTypes.setAccountVolumes:
      const { accountVolumes } = payload
      return {
        ...state,
        accountVolumes,
      }

    case ActionTypes.setAccountInstances:
      const { accountInstances } = payload
      return {
        ...state,
        accountInstances,
      }

    default:
      return state
  }
}
