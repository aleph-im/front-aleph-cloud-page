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
  VolumeCost,
  VolumeCostProps,
} from './volume'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { InstanceSpecsProp } from '@/hooks/form/useSelectInstanceSpecs'
import { VolumeProp } from '@/hooks/form/useAddVolume'
import { DomainProp } from '@/hooks/form/useAddDomains'
import { AddDomain, AddDomainTarget, DomainManager } from './domain'
import { EntityType } from '@/helpers/constants'

type ExecutableCapabilitiesProps = {
  internetAccess?: boolean
  blockchainRPC?: boolean
  enableSnapshots?: boolean
}

export type ExecutableCostProps = VolumeCostProps & {
  type: EntityType.Instance | EntityType.Program
  isPersistent?: boolean
  specs?: InstanceSpecsProp
  capabilities?: ExecutableCapabilitiesProps
}

export type ExecutableCost = Omit<VolumeCost, 'totalCost'> & {
  computeTotalCost: number
  volumeTotalCost: number
  totalCost: number
}

export abstract class Executable {
  /**
   * Calculates the amount of tokens required to deploy a function
   * https://medium.com/aleph-im/aleph-im-tokenomics-update-nov-2022-fd1027762d99
   */
  static getExecutableCost = ({
    type,
    isPersistent,
    specs,
    capabilities = {},
    volumes = [],
  }: ExecutableCostProps): ExecutableCost => {
    if (!specs)
      return {
        computeTotalCost: 0,
        volumeTotalCost: 0,
        perVolumeCost: {},
        totalCost: 0,
      }

    isPersistent = type === EntityType.Instance ? true : isPersistent
    const basePrice = isPersistent ? 2_000 : 200

    const capabilitiesCost = Object.values(capabilities).reduce(
      (ac, cv) => ac + Number(cv),
      1, // @note: baseAlephAPI always included,
    )

    const computeTotalCost = basePrice * specs.cpu * capabilitiesCost

    const newVolumes = volumes.filter(
      (volume) => volume.volumeType !== VolumeType.Existing,
    )

    const sizeDiscount = type === EntityType.Instance ? 0 : specs.storage

    const { perVolumeCost, totalCost: volumeTotalCost } = VolumeManager.getCost(
      { volumes: newVolumes, sizeDiscount },
    )

    const totalCost = volumeTotalCost + computeTotalCost

    return {
      computeTotalCost,
      perVolumeCost,
      volumeTotalCost,
      totalCost,
    }
  }

  constructor(
    protected account: Account,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
  ) { }

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
    programType: EntityType.Program | EntityType.Instance,
    ref: string,
    domains?: DomainProp[],
  ): Promise<void> {
    if (!domains) return

    const parsedDomains: AddDomain[] = domains.map(({ name }) => {
      return {
        name,
        ref,
        programType,
        target: AddDomainTarget.Program,
      }
    })

    await this.domainManager.add(parsedDomains, false)
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
