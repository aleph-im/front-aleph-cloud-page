import { useMemo } from 'react'
import { AnyProduct, ellipseAddress } from '@/helpers/utils'
import { EntityType } from '@/helpers/constants'
import {
  UseAccountProductsReturn,
  useAccountProducts,
} from '@/hooks/common/useAccountProducts'
import useConnectedWard from '@/hooks/common/useConnectedWard'

export type AnyProductRow = {
  id: string
  type: EntityType
  name: string
  size: number
  date: string
  url: string
}

export type DashboardHomePage = UseAccountProductsReturn & {
  all: AnyProductRow[]
}

export function useDashboardHomePage(): DashboardHomePage {
  useConnectedWard()
  const products = useAccountProducts()

  const all: AnyProductRow[] = useMemo(() => {
    return Object.values(products)
      .flatMap((product) => product as AnyProduct[])
      .map((product) => {
        const { id, type, date, url } = product

        const name =
          (type === EntityType.SSHKey
            ? product.label
            : type === EntityType.Instance || type === EntityType.Program
            ? product.metadata?.name
            : ellipseAddress(product.id || '')) || `Unknown ${type}`

        const size =
          (type === EntityType.SSHKey
            ? new Blob([product.key]).size
            : product.size) || 0

        return {
          id,
          type,
          name,
          size,
          date,
          url,
        }
      })
  }, [products])

  return {
    ...products,
    all,
  }
}
