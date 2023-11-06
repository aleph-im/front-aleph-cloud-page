import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { SSHKey, SSHKeyManager } from '../domain/ssh'
import { Volume, VolumeManager } from '@/domain/volume'
import { Instance, InstanceManager } from '@/domain/instance'
import { Program, ProgramManager } from '@/domain/program'
import { AccountFilesResponse, FileManager } from '@/domain/file'
import { MessageManager } from '@/domain/message'
import { Domain, DomainManager } from '@/domain/domain'

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
  setAccountDomains,
  addAccountDomain,
  delAccountDomain,
}

export type State = {
  account?: Account
  accountBalance?: number
  accountInstances?: Instance[]
  accountFunctions?: Program[]
  accountVolumes?: Volume[]
  accountFiles?: AccountFilesResponse
  accountSSHKeys?: SSHKey[]
  accountDomains?: Domain[]

  fileManager?: FileManager
  messageManager?: MessageManager
  sshKeyManager?: SSHKeyManager
  domainManager?: DomainManager
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
  accountDomains: undefined,

  fileManager: undefined,
  messageManager: undefined,
  sshKeyManager: undefined,
  domainManager: undefined,
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
      const { account, fs } = payload

      const fileManager = new FileManager(account, fs)
      const messageManager = new MessageManager(account)
      const sshKeyManager = new SSHKeyManager(account)
      const domainManager = new DomainManager(account)
      const volumeManager = new VolumeManager(account, fileManager)
      const programManager = new ProgramManager(
        account,
        volumeManager,
        domainManager,
        messageManager,
        fileManager,
      )
      const instanceManager = new InstanceManager(
        account,
        volumeManager,
        domainManager,
        sshKeyManager,
        fileManager,
      )

      return {
        ...state,
        account,

        fileManager,
        messageManager,
        sshKeyManager,
        domainManager,
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
        domainManager: undefined,
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

    // ------ Instances --------

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

    // ------ Domains --------

    case ActionTypes.setAccountDomains: {
      const accountDomains = replaceCollection(
        payload.accountDomains,
        state.accountDomains,
      )

      return {
        ...state,
        accountDomains,
      }
    }

    case ActionTypes.addAccountDomain: {
      const accountDomains = addEntityToCollection(
        payload.accountDomain,
        state.accountDomains,
      )

      return {
        ...state,
        accountDomains,
      }
    }

    case ActionTypes.delAccountDomain: {
      const accountDomains = delEntityFromCollection(
        payload.id,
        state.accountDomains,
      )

      return {
        ...state,
        accountDomains,
      }
    }

    default: {
      return state
    }
  }
}
