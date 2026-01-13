import { memo } from 'react'
import { StyledTable } from './styles'
import { TableProps } from '@aleph-front/core'
import { StyledTableProps } from '../Table'

export const EntityTable = <T extends Record<string, unknown>>(
  props: TableProps<T> & StyledTableProps,
) => {
  return <StyledTable {...(props as any)} />
}
EntityTable.displayName = 'EntityTable'

export default memo(EntityTable) as typeof EntityTable
