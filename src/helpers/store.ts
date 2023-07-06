import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { SSHKey } from '../domain/ssh'
import { Volume } from '@/domain/volume'
import { Instance } from '@/domain/instance'
import { Program } from '@/domain/program'
import { AccountFilesResponse } from '@/domain/file'

export enum ActionTypes {
  connect,
  disconnect,
  setAccountBalance,
  setAccountFiles,
  setAccountSSHKeys,
  addAccountSSHKey,
  setAccountFunctions,
  addAccountFunction,
  setAccountVolumes,
  addAccountVolume,
  setAccountInstances,
  addAccountInstance,
}

export type State = {
  account?: Account
  accountBalance?: number
  accountInstances?: Instance[]
  accountFunctions?: Program[]
  accountVolumes?: Volume[]
  accountFiles?: AccountFilesResponse
  accountSSHKeys?: SSHKey[]
}

export type Action = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
  type: ActionTypes
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

function addEntityToCollection<E extends { id: string }>(
  entity: E,
  collection?: E[],
): E[] {
  const entities = (collection || []) as E[]

  const map = new Map(entities.map((entity) => [entity.id, entity]))
  map.set(entity.id, entity)

  return Array.from(map.values())
}

export const reducer = (
  state: State = initialState,
  { type, payload }: Action,
) => {
  switch (type) {
    case ActionTypes.connect: {
      return {
        ...state,
        account: payload.account,
      }
    }

    case ActionTypes.disconnect: {
      return {
        ...state,
        account: undefined,
      }
    }

    case ActionTypes.setAccountBalance: {
      return {
        ...state,
        accountBalance: payload.balance,
      }
    }

    case ActionTypes.setAccountFiles: {
      return {
        ...state,
        accountFiles: payload.accountFiles,
      }
    }

    case ActionTypes.setAccountSSHKeys: {
      return {
        ...state,
        accountSSHKeys: payload.accountSSHKeys,
      }
    }

    case ActionTypes.addAccountSSHKey: {
      const accountSSHKeys = addEntityToCollection(
        payload.accountSSHKey,
        state.accountSSHKeys,
      )

      return {
        ...state,
        accountSSHKeys,
      }
    }

    case ActionTypes.setAccountFunctions: {
      const { accountFunctions } = payload
      return {
        ...state,
        accountFunctions,
      }
    }

    case ActionTypes.addAccountFunction: {
      const accountFunctions = addEntityToCollection(
        payload.accountFunction,
        state.accountFunctions,
      )

      return {
        ...state,
        accountFunctions,
      }
    }

    case ActionTypes.setAccountVolumes: {
      const { accountVolumes } = payload
      return {
        ...state,
        accountVolumes,
      }
    }

    case ActionTypes.addAccountVolume: {
      const accountVolumes = addEntityToCollection(
        payload.accountVolume,
        state.accountVolumes,
      )

      return {
        ...state,
        accountVolumes,
      }
    }

    case ActionTypes.setAccountInstances: {
      const { accountInstances } = payload
      return {
        ...state,
        accountInstances,
      }
    }

    case ActionTypes.addAccountInstance: {
      const accountInstances = addEntityToCollection(
        payload.accountInstance,
        state.accountInstances,
      )

      return {
        ...state,
        accountInstances,
      }
    }

    default: {
      return state
    }
  }
}
