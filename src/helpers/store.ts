import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { SSHKey, SSHKeyManager } from '../domain/ssh'
import { Volume, VolumeManager } from '@/domain/volume'
import { Instance, InstanceManager } from '@/domain/instance'
import { Program, ProgramManager } from '@/domain/program'
import { AccountFilesResponse, FileManager } from '@/domain/file'
import { MessageManager } from '@/domain/message'

export enum ActionTypes {
  connect,
  disconnect,
  setAccountBalance,
  setAccountFiles,
  setAccountSSHKeys,
  addAccountSSHKey,
  delAccountSSHKey,
  setAccountFunctions,
  addAccountFunction,
  delAccountFunction,
  setAccountVolumes,
  addAccountVolume,
  delAccountVolume,
  setAccountInstances,
  addAccountInstance,
  delAccountInstance,
}

export type State = {
  account?: Account
  accountBalance?: number
  accountInstances?: Instance[]
  accountFunctions?: Program[]
  accountVolumes?: Volume[]
  accountFiles?: AccountFilesResponse
  accountSSHKeys?: SSHKey[]

  fileManager?: FileManager
  messageManager?: MessageManager
  sshKeyManager?: SSHKeyManager
  volumeManager?: VolumeManager
  programManager?: ProgramManager
  instanceManager?: InstanceManager
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

  fileManager: undefined,
  messageManager: undefined,
  sshKeyManager: undefined,
  volumeManager: undefined,
  programManager: undefined,
  instanceManager: undefined,
}

function addEntitiesToCollection<E extends { id: string }>(
  entities: E[],
  collection: E[] = [],
): E[] {
  const map = new Map(collection.map((entity) => [entity.id, entity]))

  for (const entity of entities) {
    map.set(entity.id, entity)
  }

  return Array.from(map.values())
}

function addEntityToCollection<E extends { id: string }>(
  entity: E,
  collection?: E[],
): E[] {
  return addEntitiesToCollection([entity], collection)
}

function delEntityFromCollection<E extends { id: string }>(
  id: string,
  collection: E[] = [],
): E[] {
  return collection.filter((e) => e.id !== id)
}

function replaceCollection<E extends { id: string; confirmed?: boolean }>(
  entities: E[],
  collection: E[] = [],
): E[] {
  const notConfirmedCollection = collection.filter((e) => !e.confirmed)

  return addEntitiesToCollection(entities, notConfirmedCollection)
}

export const reducer = (
  state: State = initialState,
  { type, payload }: Action,
) => {
  switch (type) {
    case ActionTypes.connect: {
      const { account } = payload

      const fileManager = new FileManager(account)
      const messageManager = new MessageManager(account)
      const sshKeyManager = new SSHKeyManager(account)
      const volumeManager = new VolumeManager(account, fileManager)
      const programManager = new ProgramManager(
        account,
        volumeManager,
        messageManager,
        fileManager,
      )
      const instanceManager = new InstanceManager(
        account,
        volumeManager,
        sshKeyManager,
        fileManager,
      )

      return {
        ...state,
        account,

        fileManager,
        messageManager,
        sshKeyManager,
        volumeManager,
        programManager,
        instanceManager,
      }
    }

    case ActionTypes.disconnect: {
      return {
        ...state,
        account: undefined,

        fileManager: undefined,
        messageManager: undefined,
        sshKeyManager: undefined,
        volumeManager: undefined,
        programManager: undefined,
        instanceManager: undefined,
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

    // ------ SSH Keys --------

    case ActionTypes.setAccountSSHKeys: {
      const accountSSHKeys = replaceCollection(
        payload.accountSSHKeys,
        state.accountSSHKeys,
      )

      return {
        ...state,
        accountSSHKeys,
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

    case ActionTypes.delAccountSSHKey: {
      const accountSSHKeys = delEntityFromCollection(
        payload.id,
        state.accountSSHKeys,
      )

      return {
        ...state,
        accountSSHKeys,
      }
    }

    // ------ Functions --------

    case ActionTypes.setAccountFunctions: {
      const accountFunctions = replaceCollection(
        payload.accountFunctions,
        state.accountFunctions,
      )

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

    case ActionTypes.delAccountFunction: {
      const accountFunctions = delEntityFromCollection(
        payload.id,
        state.accountFunctions,
      )

      return {
        ...state,
        accountFunctions,
      }
    }

    // ------ Volumes --------

    case ActionTypes.setAccountVolumes: {
      const accountVolumes = replaceCollection(
        payload.accountVolumes,
        state.accountVolumes,
      )

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

    case ActionTypes.delAccountVolume: {
      const accountVolumes = delEntityFromCollection(
        payload.id,
        state.accountVolumes,
      )

      return {
        ...state,
        accountVolumes,
      }
    }

    // ------ Volumes --------

    case ActionTypes.setAccountInstances: {
      const accountInstances = replaceCollection(
        payload.accountInstances,
        state.accountInstances,
      )

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

    case ActionTypes.delAccountInstance: {
      const accountInstances = delEntityFromCollection(
        payload.id,
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
