import { ProgramMessage, StoreMessage } from 'aleph-sdk-ts/dist/messages/types'
import { Instance } from '@/helpers/instance'
import { useAccountSSHKeys } from './useAccountSSHKeys'
import { SSHKey } from '@/helpers/ssh'
import { useAccountFunctions } from './useAccountFunctions'
import { useAccountVolumes } from './useAccountVolumes'
import { useAccountInstances } from './useAccountInstances'

export type UseAccountProductsReturn = {
  functions: ProgramMessage[]
  instances: Instance[]
  volumes: StoreMessage[]
  sshKeys: SSHKey[]
}

export function useAccountProducts(): UseAccountProductsReturn {
  const [functions = []] = useAccountFunctions()
  const [volumes = []] = useAccountVolumes()
  const [instances = []] = useAccountInstances()
  const [sshKeys = []] = useAccountSSHKeys()

  return {
    functions,
    volumes,
    instances,
    sshKeys,
  }
}
