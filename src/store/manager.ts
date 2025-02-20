import { Account } from '@aleph-sdk/account'
import { SSHKeyManager } from '../domain/ssh'
import { VolumeManager } from '@/domain/volume'
import { InstanceManager } from '@/domain/instance'
import { ProgramManager } from '@/domain/program'
import { FileManager } from '@/domain/file'
import { MessageManager } from '@/domain/message'
import { DomainManager } from '@/domain/domain'
import { WebsiteManager } from '@/domain/website'
import { NodeManager } from '@/domain/node'
import { apiServer } from '@/helpers/constants'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'

import { StoreReducer } from './store'
import { ConnectionAction, ConnectionActionType } from './connection'
import { ConfidentialManager } from '@/domain/confidential'
import { VoucherManager } from '@/domain/voucher'
import { GpuInstanceManager } from '@/domain/gpuInstance'
import { CostManager } from '@/domain/cost'

function createDefaultManagers(account?: Account) {
  const sdkClient = !account
    ? new AlephHttpClient(apiServer)
    : new AuthenticatedAlephHttpClient(account, apiServer)

  const fileManager = new FileManager(sdkClient, account)

  const nodeManager = new NodeManager(fileManager, sdkClient, account)

  const costManager = new CostManager(sdkClient)

  return {
    sdkClient,
    fileManager,
    nodeManager,
    costManager,
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
  gpuInstanceManager?: GpuInstanceManager
  confidentialManager?: ConfidentialManager
  websiteManager?: WebsiteManager
  voucherManager?: VoucherManager
  costManager?: CostManager
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
  gpuInstanceManager: undefined,
  confidentialManager: undefined,
  websiteManager: undefined,
  voucherManager: undefined,
  costManager: undefined,
}

export type ManagerAction = ConnectionAction

export type ManagerReducer = StoreReducer<ManagerState, ManagerAction>

export function getManagerReducer(): ManagerReducer {
  return (state = initialState, action) => {
    switch (action.type) {
      case ConnectionActionType.CONNECTION_DISCONNECT: {
        const { nodeManager, fileManager, costManager } =
          createDefaultManagers()

        return {
          ...state,
          nodeManager,
          fileManager,
          costManager,
          messageManager: undefined,
          sshKeyManager: undefined,
          domainManager: undefined,
          volumeManager: undefined,
          programManager: undefined,
          instanceManager: undefined,
          gpuInstanceManager: undefined,
          confidentialManager: undefined,
          websiteManager: undefined,
          voucherManager: undefined,
        }
      }

      case ConnectionActionType.CONNECTION_UPDATE: {
        const { account } = action.payload

        const { nodeManager, fileManager, costManager, sdkClient } =
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
          nodeManager,
        )
        const instanceManager = new InstanceManager(
          account,
          sdkClient,
          volumeManager,
          domainManager,
          sshKeyManager,
          fileManager,
          nodeManager,
          costManager,
        )
        const gpuInstanceManager = new GpuInstanceManager(
          account,
          sdkClient,
          volumeManager,
          domainManager,
          sshKeyManager,
          fileManager,
          nodeManager,
          costManager,
        )
        const confidentialManager = new ConfidentialManager(
          account,
          sdkClient,
          volumeManager,
          domainManager,
          sshKeyManager,
          fileManager,
          nodeManager,
        )
        const websiteManager = new WebsiteManager(
          account,
          sdkClient,
          volumeManager,
          domainManager,
        )
        const voucherManager = new VoucherManager(account, sdkClient)

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
          gpuInstanceManager,
          confidentialManager,
          websiteManager,
          voucherManager,
          costManager,
        }
      }

      default: {
        return state
      }
    }
  }
}
