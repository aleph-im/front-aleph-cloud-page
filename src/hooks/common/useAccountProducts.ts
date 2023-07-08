import { useAccountSSHKeys } from './useAccountSSHKeys'
import { SSHKey } from '@/domain/ssh'
import { useAccountFunctions } from './useAccountFunctions'
import { useAccountVolumes } from './useAccountVolumes'
import { useAccountInstances } from './useAccountInstances'
import { Instance } from '@/domain/instance'
import { Volume } from '@/domain/volume'
import { Program } from '@/domain/program'

export type UseAccountProductsReturn = {
  functions: Program[]
  instances: Instance[]
  volumes: Volume[]
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
