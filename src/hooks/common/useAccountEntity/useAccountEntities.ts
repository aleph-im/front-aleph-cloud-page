import { useAccountSSHKeys } from './useAccountSSHKeys'
import { SSHKey } from '@/domain/ssh'
import { useAccountFunctions } from './useAccountFunctions'
import { useAccountVolumes } from './useAccountVolumes'
import { useAccountInstances } from './useAccountInstances'
import { useAccountWebsites } from './useAccountWebsites'
import { Instance } from '@/domain/instance'
import { Volume } from '@/domain/volume'
import { Program } from '@/domain/program'
import { Domain } from '@/domain/domain'
import { useAccountDomains } from './useAccountDomains'
import { Website } from '@/domain/website'

export type UseAccountEntitiesReturn = {
  functions: Program[]
  instances: Instance[]
  volumes: Volume[]
  sshKeys: SSHKey[]
  domains: Domain[]
  websites: Website[]
}

export function useAccountEntities(): UseAccountEntitiesReturn {
  const [functions = []] = useAccountFunctions()
  const [volumes = []] = useAccountVolumes()
  const [instances = []] = useAccountInstances()
  const [sshKeys = []] = useAccountSSHKeys()
  const [domains = []] = useAccountDomains()
  const [websites = []] = useAccountWebsites()

  return {
    functions,
    volumes,
    instances,
    sshKeys,
    domains,
    websites,
  }
}
