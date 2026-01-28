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
import { apiServer } from '@/helpers/server'
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
import { ForwardedPortsManager } from '@/domain/forwardedPorts'
import { CreditManager } from '@/domain/credit'
import { PermissionsManager } from '@/domain/permissions'

function createDefaultManagers(account?: Account) {
  const sdkClient = !account
    ? new AlephHttpClient(apiServer)
    : new AuthenticatedAlephHttpClient(account, apiServer)

  const fileManager = new FileManager(account, undefined, sdkClient)
  const nodeManager = new NodeManager(fileManager, sdkClient, account)
  const costManager = new CostManager(sdkClient)
  const messageManager = new MessageManager(account, sdkClient)
  const sshKeyManager = new SSHKeyManager(account, sdkClient)
  const domainManager = new DomainManager(account, sdkClient)
  const volumeManager = new VolumeManager(account, sdkClient, fileManager)
  const forwardedPortsManager = new ForwardedPortsManager(account, sdkClient)

  const instanceManager = new InstanceManager(
    account,
    sdkClient,
    volumeManager,
    domainManager,
    sshKeyManager,
    fileManager,
    nodeManager,
    costManager,
    forwardedPortsManager,
  )
  const programManager = new ProgramManager(
    account,
    sdkClient,
    volumeManager,
    domainManager,
    messageManager,
    fileManager,
    nodeManager,
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
    forwardedPortsManager,
  )
  const confidentialManager = new ConfidentialManager(
    account,
    sdkClient,
    volumeManager,
    domainManager,
    sshKeyManager,
    fileManager,
    nodeManager,
    costManager,
    forwardedPortsManager,
  )
  const websiteManager = new WebsiteManager(
    account,
    sdkClient,
    volumeManager,
    domainManager,
  )
  const voucherManager = new VoucherManager(account, sdkClient)
  const creditManager = new CreditManager(account)
  const permissionsManager = new PermissionsManager(account, sdkClient)

  return {
    sdkClient,
    fileManager,
    nodeManager,
    costManager,
    messageManager,
    sshKeyManager,
    domainManager,
    volumeManager,
    instanceManager,
    programManager,
    gpuInstanceManager,
    confidentialManager,
    websiteManager,
    voucherManager,
    creditManager,
    forwardedPortsManager,
    permissionsManager,
  }
}

const {
  fileManager,
  nodeManager,
  costManager,
  messageManager,
  sshKeyManager,
  domainManager,
  volumeManager,
  instanceManager,
  programManager,
  gpuInstanceManager,
  confidentialManager,
  websiteManager,
  voucherManager,
  creditManager,
  forwardedPortsManager,
  permissionsManager,
} = createDefaultManagers()

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
  creditManager?: CreditManager
  costManager?: CostManager
  forwardedPortsManager?: ForwardedPortsManager
  permissionsManager?: PermissionsManager
}

export const initialState: ManagerState = {
  nodeManager,
  fileManager,
  costManager,
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
  creditManager,
  forwardedPortsManager,
  permissionsManager,
}

export type ManagerAction = ConnectionAction

export type ManagerReducer = StoreReducer<ManagerState, ManagerAction>

export function getManagerReducer(): ManagerReducer {
  return (state = initialState, action) => {
    switch (action.type) {
      case ConnectionActionType.CONNECTION_DISCONNECT: {
        const {
          nodeManager,
          fileManager,
          costManager,
          messageManager,
          sshKeyManager,
          domainManager,
          volumeManager,
          instanceManager,
          programManager,
          gpuInstanceManager,
          confidentialManager,
          websiteManager,
          voucherManager,
          creditManager,
          forwardedPortsManager,
          permissionsManager,
        } = createDefaultManagers()

        return {
          ...state,
          nodeManager,
          fileManager,
          costManager,
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
          creditManager,
          forwardedPortsManager,
          permissionsManager,
        }
      }

      case ConnectionActionType.CONNECTION_UPDATE: {
        const { account } = action.payload

        const {
          nodeManager,
          fileManager,
          costManager,
          messageManager,
          sshKeyManager,
          domainManager,
          volumeManager,
          instanceManager,
          programManager,
          gpuInstanceManager,
          confidentialManager,
          websiteManager,
          voucherManager,
          creditManager,
          forwardedPortsManager,
          permissionsManager,
        } = createDefaultManagers(account)

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
          creditManager,
          costManager,
          forwardedPortsManager,
          permissionsManager,
        }
      }

      default: {
        return state
      }
    }
  }
}
