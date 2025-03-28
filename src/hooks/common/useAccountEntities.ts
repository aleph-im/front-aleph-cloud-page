import { SSHKey } from '@/domain/ssh'
import { Instance } from '@/domain/instance'
import { Volume } from '@/domain/volume'
import { Program } from '@/domain/program'
import { Domain } from '@/domain/domain'
import { Website } from '@/domain/website'
import { useRequestDomains } from './useRequestEntity/useRequestDomains'
import { useRequestInstances } from './useRequestEntity/useRequestInstances'
import { useRequestSSHKeys } from './useRequestEntity/useRequestSSHKeys'
import { useRequestVolumes } from './useRequestEntity/useRequestVolumes'
import { useRequestPrograms } from './useRequestEntity/useRequestPrograms'
import { useRequestWebsites } from './useRequestEntity/useRequestWebsites'
import { useAppState } from '@/contexts/appState'
import { useRequestConfidentials } from './useRequestEntity/useRequestConfidentials'
import { Confidential } from '@/domain/confidential'
import { useRequestGpuInstances } from './useRequestEntity/useRequestGpuInstances'
import { GpuInstance } from '@/domain/gpuInstance'

export type UseAccountEntitiesReturn = {
  programs: Program[]
  instances: Instance[]
  gpuInstances: GpuInstance[]
  confidentials: Confidential[]
  volumes: Volume[]
  sshKeys: SSHKey[]
  domains: Domain[]
  websites: Website[]
}

export function useAccountEntities(): UseAccountEntitiesReturn {
  const [state] = useAppState()
  const { account } = state.connection

  const triggerDeps = [account]

  const { entities: volumes = [] } = useRequestVolumes({ triggerDeps })
  const { entities: programs = [] } = useRequestPrograms({ triggerDeps })
  const { entities: instances = [] } = useRequestInstances({ triggerDeps })
  const { entities: gpuInstances = [] } = useRequestGpuInstances({
    triggerDeps,
  })
  const { entities: confidentials = [] } = useRequestConfidentials({
    triggerDeps,
  })
  const { entities: sshKeys = [] } = useRequestSSHKeys({ triggerDeps })
  const { entities: domains = [] } = useRequestDomains({ triggerDeps })
  const { entities: websites = [] } = useRequestWebsites({ triggerDeps })

  return {
    programs,
    volumes,
    instances,
    gpuInstances,
    confidentials,
    sshKeys,
    domains,
    websites,
  }
}
