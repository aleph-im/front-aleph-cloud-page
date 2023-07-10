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
