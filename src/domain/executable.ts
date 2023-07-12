import { EnvVarProp } from '@/hooks/form/useAddEnvVars'
import {
  MachineResources,
  MachineVolume,
} from 'aleph-sdk-ts/dist/messages/types'
import {
  VolumeManager,
  VolumeType,
  AddExistingVolume,
  AddPersistentVolume,
} from './volume'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { InstanceSpecsProp } from '@/hooks/form/useSelectInstanceSpecs'
import { VolumeProp } from '@/hooks/form/useAddVolume'
import { DomainProp } from '@/hooks/form/useAddDomains'
import { AddDomainTarget, Domain, DomainManager } from './domain'
import { EntityType } from '@/helpers/constants'

export abstract class Executable {
  constructor(
    protected account: Account,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
  ) {}

  protected parseEnvVars(
    envVars?: EnvVarProp[],
  ): Record<string, string> | undefined {
    if (!envVars) return

    return envVars.reduce((acc, env) => {
      const name = env.name.trim()
      const value = env.value.trim()

      if (name.length <= 0) throw new Error(`Invalid env var name "${name}"`)
      if (value.length <= 0) throw new Error(`Invalid env var value "${value}"`)

      acc[name] = value

      return acc
    }, {} as Record<string, string>)
  }

  protected async parseDomains(
    ref: string,
    domains?: DomainProp[],
  ): Promise<void> {
    if (!domains) return

    const parsedDomains = domains.map((domain) => {
      const name = domain.name.trim()

      if (name.length <= 0) throw new Error(`Invalid domain name "${name}"`)

      return {
        id: name,
        name,
        ref,
        target: AddDomainTarget.Program,
        type: EntityType.Domain,
      } as Domain
    })

    await this.domainManager.add(parsedDomains)
  }

  protected async parseVolumes(
    volumes?: VolumeProp | VolumeProp[],
  ): Promise<MachineVolume[] | undefined> {
    if (!volumes) return

    volumes = Array.isArray(volumes) ? volumes : [volumes]

    // @note: Create new volumes before and cast them to ExistingVolume type

    const messages = await this.volumeManager.add(volumes)

    const parsedVolumes: (AddExistingVolume | AddPersistentVolume)[] =
      volumes.map((volume, i) => {
        if (volume.volumeType === VolumeType.New) {
          return {
            ...volume,
            volumeType: VolumeType.Existing,
            refHash: messages[i].id,
          } as AddExistingVolume
        }

        return volume
      })

    // @todo: Fix SDK types (mount is not an string[], remove is_read_only fn)
    return parsedVolumes.map((volume) => {
      if (volume.volumeType === VolumeType.Persistent) {
        const { mountPath: mount, size: size_mib, name } = volume

        return {
          persistence: 'host',
          mount,
          size_mib,
          name,
        }
      }

      const {
        refHash: ref,
        mountPath: mount,
        useLatest: use_latest = false,
      } = volume

      return { ref, mount, use_latest }
    }) as unknown as MachineVolume[]
  }

  protected parseSpecs(
    specs?: InstanceSpecsProp,
  ): Omit<MachineResources, 'seconds'> {
    if (!specs) throw new Error('Invalid program specs')
    if (!specs.cpu) throw new Error('Invalid program cpu cores')
    if (!specs.ram) throw new Error('Invalid program ram size')

    return {
      vcpus: specs.cpu,
      memory: specs.ram,
    }
  }

  protected parseMetadata(
    name = 'Untitled',
    tags?: string[],
  ): Record<string, unknown> {
    const metadata: Record<string, unknown> = {}

    name = name.trim()

    if (name) {
      metadata.name = name
    }

    if (tags && tags.length > 0) {
      metadata.tags = tags
    }

    return metadata
  }
}
