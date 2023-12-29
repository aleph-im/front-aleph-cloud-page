import { memo } from 'react'
import { StyledTable } from './styles'
import { TableProps } from '@aleph-front/aleph-core'

export const EntityTable = <T extends Record<string, unknown>>(
  props: TableProps<T>,
) => {
  return <StyledTable {...(props as any)} />
}
EntityTable.displayName = 'EntityTable'

export default memo(EntityTable) as typeof EntityTable
