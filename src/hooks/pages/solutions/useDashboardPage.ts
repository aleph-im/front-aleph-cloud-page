import { useMemo } from 'react'
import { AnyEntity, ellipseAddress } from '@/helpers/utils'
import { EntityType } from '@/helpers/constants'
import { Volume } from '@/domain/volume'
import {
  UseAccountEntitiesReturn,
  useAccountEntities,
} from '@/hooks/common/useAccountEntities'

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
    return (
      Object.values(entities)
        .flatMap((entity) => entity as AnyEntity[])
        .map((entity) => {
          const { id, type, confirmed, date } = entity
          const name =
            (type !== EntityType.Volume
              ? entity.name
              : ellipseAddress(entity.id || '')) || `Unknown ${type}`
          const size = entity.size || 0
          const url =
            entity.type === EntityType.Domain ||
            entity.type === EntityType.Program ||
            entity.type === EntityType.Website
              ? entity.refUrl
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .sort((a, b) => b.date!.localeCompare(a.date!))
    )
  }, [entities])

  return {
    ...entities,
    all,
  }
}
