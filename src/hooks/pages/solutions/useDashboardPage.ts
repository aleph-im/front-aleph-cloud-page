import { useMemo } from 'react'
import { AnyEntity, convertByteUnits, ellipseAddress } from '@/helpers/utils'
import { EntityType } from '@/helpers/constants'
import { Volume } from '@/domain/volume'
import {
  UseAccountEntitiesReturn,
  useAccountEntities,
} from '@/hooks/common/useAccountEntity/useAccountEntities'

export type AnyEntityRow = {
  id: string
  type: EntityType
  name: string
  size: number
  volume?: Volume
  volume_id?: string
  date?: string
  updated_at?: string
  url?: string
  confirmed?: boolean
}

export type UseDashboardPageReturn = UseAccountEntitiesReturn & {
  all: AnyEntityRow[]
}

export function useDashboardPage(): UseDashboardPageReturn {
  const entities = useAccountEntities()

  const all: AnyEntityRow[] = useMemo(() => {
    return Object.values(entities)
      .flatMap((entity) => entity as AnyEntity[])
      .map((entity) => {
        const { id, type, confirmed } = entity

        const name =
          (type === EntityType.SSHKey
            ? entity.label
            : type === EntityType.Instance ||
                type === EntityType.Program ||
                type === EntityType.Website
              ? entity.metadata?.name
              : type === EntityType.Domain
                ? entity.name
                : ellipseAddress(entity.id || '')) || `Unknown ${type}`

        const size =
          (type === EntityType.SSHKey
            ? convertByteUnits(new Blob([entity.key]).size, {
                from: 'B',
                to: 'MiB',
              })
            : type === EntityType.Domain || type === EntityType.Website
              ? 0
              : entity.size) || 0

        const date =
          entity.type === EntityType.Domain
            ? entity.updated_at.slice(0, 19).replace('T', ' ')
            : entity.type === EntityType.Website
              ? entity.updated_at
              : entity.date
        const url =
          entity.type === EntityType.Domain
            ? ''
            : entity.type === EntityType.Website
              ? `/storage/volume/${entity.volume_id}`
              : entity.url

        return {
          id,
          type,
          name,
          size,
          date,
          url,
          confirmed,
        } as AnyEntityRow
      })
  }, [entities]).sort((a, b) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (b.date ?? b.updated_at!).localeCompare(a.date ?? a.updated_at!),
  )

  return {
    ...entities,
    all,
  }
}
