import { Account } from '@aleph-sdk/account'
import { SSHKeyManager } from '../domain/ssh'
import { VolumeManager } from '@/domain/volume'
import { InstanceManager } from '@/domain/instance'
import { ProgramManager } from '@/domain/program'
import { FileManager } from '@/domain/file'
import { MessageManager } from '@/domain/message'
import { DomainManager } from '@/domain/domain'
import { IndexerManager } from '@/domain/indexer'
import { NodeManager } from '@/domain/node'
import { apiServer } from '@/helpers/constants'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'

import { StoreReducer } from './store'
import { ConnectionAction, ConnectionActionType } from './connection'

function createDefaultManagers(account?: Account) {
  const sdkClient = !account
    ? new AlephHttpClient(apiServer)
    : new AuthenticatedAlephHttpClient(account, apiServer)

  const fileManager = new FileManager(sdkClient, account)

  const nodeManager = new NodeManager(fileManager, sdkClient, account)

  return {
    sdkClient,
    fileManager,
    nodeManager,
  }
}

const { fileManager, nodeManager } = createDefaultManagers()

export type ManagerState = {
  nodeManager: NodeManager
  fileManager: FileManager
  messageManager?: MessageManager
  sshKeyManager?: SSHKeyManager
  domainManager?: DomainManager
  volumeManager?: VolumeManager
  programManager?: ProgramManager
  instanceManager?: InstanceManager
  indexerManager?: IndexerManager
}

export const initialState: ManagerState = {
  nodeManager,
  fileManager,
  messageManager: undefined,
  sshKeyManager: undefined,
  domainManager: undefined,
  volumeManager: undefined,
  programManager: undefined,
  instanceManager: undefined,
  indexerManager: undefined,
}

export type ManagerAction = ConnectionAction

export type ManagerReducer = StoreReducer<ManagerState, ManagerAction>

export function getManagerReducer(): ManagerReducer {
  return (state = initialState, action) => {
    switch (action.type) {
      case ConnectionActionType.CONNECTION_DISCONNECT: {
        const { nodeManager, fileManager } = createDefaultManagers()

        return {
          ...state,
          nodeManager,
          fileManager,
          messageManager: undefined,
          sshKeyManager: undefined,
          domainManager: undefined,
          volumeManager: undefined,
          programManager: undefined,
          instanceManager: undefined,
          indexerManager: undefined,
        }
      }

      case ConnectionActionType.CONNECTION_UPDATE: {
        const { account } = action.payload

        const { nodeManager, fileManager, sdkClient } =
          createDefaultManagers(account)

        const messageManager = new MessageManager(account, sdkClient)
        const sshKeyManager = new SSHKeyManager(account, sdkClient)
        const domainManager = new DomainManager(account, sdkClient)
        const volumeManager = new VolumeManager(account, sdkClient, fileManager)
        const programManager = new ProgramManager(
          account,
          sdkClient,
          volumeManager,
          domainManager,
          messageManager,
          fileManager,
        )
        const instanceManager = new InstanceManager(
          account,
          sdkClient,
          volumeManager,
          domainManager,
          sshKeyManager,
          fileManager,
          nodeManager,
        )
        const indexerManager = new IndexerManager(
          account,
          sdkClient,
          programManager,
        )

        return {
          ...state,
          nodeManager,
          fileManager,
          messageManager,
          sshKeyManager,
          domainManager,
          volumeManager,
          programManager,
          instanceManager,
          indexerManager,
        }
      }

      default: {
        return state
      }
    }
  }
}
