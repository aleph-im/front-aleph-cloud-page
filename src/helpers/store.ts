import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { SSHKey, SSHKeyManager } from '../domain/ssh'
import { Volume, VolumeManager } from '@/domain/volume'
import { Instance, InstanceManager } from '@/domain/instance'
import { Program, ProgramManager } from '@/domain/program'
import { AccountFilesResponse, FileManager } from '@/domain/file'
import { MessageManager } from '@/domain/message'
import { Domain, DomainManager } from '@/domain/domain'
import { IndexerManager } from '@/domain/indexer'
import { NodeManager } from '@/domain/node'
import { defaultAccountChannel } from '@/helpers/constants'
import { Website, WebsiteManager } from '@/domain/website'

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
  setAccountWebsites,
  addAccountWebsite,
  delAccountWebsite,
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
  accountWebsites?: Website[]

  fileManager: FileManager
  messageManager?: MessageManager
  sshKeyManager?: SSHKeyManager
  domainManager?: DomainManager
  volumeManager?: VolumeManager
  websiteManager?: WebsiteManager
  programManager?: ProgramManager
  instanceManager?: InstanceManager
  indexerManager?: IndexerManager
  nodeManager: NodeManager
}

export type Action = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
  type: ActionTypes
}

function createDefaultManagers(account?: Account) {
  const fileManager = new FileManager(account)

  const nodeManager = new NodeManager(
    account,
    defaultAccountChannel,
    fileManager,
  )

  return {
    fileManager,
    nodeManager,
    messageManager: undefined,
    sshKeyManager: undefined,
    domainManager: undefined,
    volumeManager: undefined,
    websiteManager: undefined,
    programManager: undefined,
    instanceManager: undefined,
    indexerManager: undefined,
  }
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

  ...createDefaultManagers(),
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
      const domainManager = new DomainManager(account)
      const volumeManager = new VolumeManager(account, fileManager)
      const websiteManager = new WebsiteManager(account, volumeManager)
      const programManager = new ProgramManager(
        account,
        volumeManager,
        domainManager,
        messageManager,
        fileManager,
      )
      const nodeManager = new NodeManager(
        account,
        defaultAccountChannel,
        fileManager,
      )
      const instanceManager = new InstanceManager(
        account,
        volumeManager,
        domainManager,
        sshKeyManager,
        fileManager,
        nodeManager,
      )

      const indexerManager = new IndexerManager(account, programManager)

      return {
        ...state,
        account,

        fileManager,
        messageManager,
        sshKeyManager,
        domainManager,
        volumeManager,
        websiteManager,
        programManager,
        instanceManager,
        indexerManager,
        nodeManager,
      }
    }

    case ActionTypes.disconnect: {
      return {
        ...state,
        account: undefined,
        ...createDefaultManagers(),
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

    // ------ Websites --------

    case ActionTypes.setAccountWebsites: {
      const accountWebsites = replaceCollection(
        payload.accountWebsites,
        state.accountWebsites,
      )

      return {
        ...state,
        accountWebsites,
      }
    }

    case ActionTypes.addAccountWebsite: {
      const accountWebsites = addEntityToCollection(
        payload.accountWebsite,
        state.accountWebsites,
      )

      return {
        ...state,
        accountWebsites,
      }
    }

    case ActionTypes.delAccountWebsite: {
      const accountWebsites = delEntityFromCollection(
        payload.id,
        state.accountWebsites,
      )

      return {
        ...state,
        accountWebsites,
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
