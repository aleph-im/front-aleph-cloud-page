import { useMemo } from 'react'
import { AnyEntity, convertByteUnits, ellipseAddress } from '@/helpers/utils'
import { EntityType } from '@/helpers/constants'
import {
  UseAccountEntitiesReturn,
  useAccountEntities,
} from '@/hooks/common/useAccountEntity/useAccountEntities'
import useConnectedWard from '@/hooks/common/useConnectedWard'

export type AnyEntityRow = {
  id: string
  type: EntityType
  name: string
  size: number
  date?: string
  url?: string
  confirmed?: boolean
}

export type DashboardHomePage = UseAccountEntitiesReturn & {
  all: AnyEntityRow[]
}

export function useDashboardHomePage(): DashboardHomePage {
  useConnectedWard()
  const entities = useAccountEntities()

  const all: AnyEntityRow[] = useMemo(() => {
    return Object.values(entities)
      .flatMap((entity) => entity as AnyEntity[])
      .map((entity) => {
        const { id, type, confirmed } = entity

        const name =
          (type === EntityType.SSHKey
            ? entity.label
            : type === EntityType.Instance || type === EntityType.Program
            ? entity.metadata?.name
            : ellipseAddress(entity.id || '')) || `Unknown ${type}`

        const size =
          (type === EntityType.SSHKey
            ? convertByteUnits(new Blob([entity.key]).size, {
                from: 'B',
                to: 'MiB',
              })
            : type === EntityType.Domain
            ? 0
            : entity.size) || 0

        const date = entity.type === EntityType.Domain ? '' : entity.date
        const url = entity.type === EntityType.Domain ? '' : entity.url

        return {
          id,
          type,
          name,
          size,
          date,
          url,
          confirmed,
        }
      })
  }, [entities])

  return {
    ...entities,
    all,
  }
}
