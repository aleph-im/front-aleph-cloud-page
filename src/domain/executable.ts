import { EnvVarField } from '@/hooks/form/useAddEnvVars'
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
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { DomainField } from '@/hooks/form/useAddDomains'
import { Domain, DomainManager } from './domain'
import { EntityType } from '@/helpers/constants'

type ExecutableCapabilitiesProps = {
  internetAccess?: boolean
  blockchainRPC?: boolean
  enableSnapshots?: boolean
}

export type ExecutableCostProps = VolumeCostProps & {
  type: EntityType.Instance | EntityType.Program
  isPersistent?: boolean
  specs?: InstanceSpecsField
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
        perVolumeCost: [],
        totalCost: 0,
      }

    isPersistent = type === EntityType.Instance ? true : isPersistent
    const basePrice = isPersistent ? 2_000 : 200

    const capabilitiesCost = Object.values(capabilities).reduce(
      (ac, cv) => ac + Number(cv),
      1, // @note: baseAlephAPI always included,
    )

    const computeTotalCost = basePrice * specs.cpu * capabilitiesCost

    const sizeDiscount = type === EntityType.Instance ? 0 : specs.storage

    const { perVolumeCost, totalCost: volumeTotalCost } = VolumeManager.getCost(
      { volumes, sizeDiscount },
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
  ) {}

  protected parseEnvVars(
    envVars?: EnvVarField[],
  ): Record<string, string> | undefined {
    if (!envVars || envVars.length === 0) return
    return Object.fromEntries(envVars.map(({ name, value }) => [name, value]))
  }

  protected async parseDomains(
    ref: string,
    domains?: Omit<DomainField, 'ref'>[],
  ): Promise<Domain[]> {
    if (!domains || domains.length === 0) return []

    const parsedDomains = domains.map((domain) => ({
      ...domain,
      ref,
    }))

    return this.domainManager.add(parsedDomains, false)
  }

  protected async parseVolumes(
    volumes?: VolumeField | VolumeField[],
  ): Promise<MachineVolume[] | undefined> {
    if (!volumes) return

    volumes = Array.isArray(volumes) ? volumes : [volumes]

    if (volumes.length === 0) return

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
    specs: InstanceSpecsField,
  ): Omit<MachineResources, 'seconds'> {
    return {
      vcpus: specs.cpu,
      memory: specs.ram,
    }
  }

  protected parseMetadata(
    name = 'Untitled',
    tags?: string[],
    metadata?: Record<string, unknown>,
  ): Record<string, unknown> {
    const out: Record<string, unknown> = { name }

    if (tags && tags.length > 0) {
      out.tags = tags
    }

    return {
      ...metadata,
      ...out,
    }
  }
}
