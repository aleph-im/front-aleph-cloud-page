import { memo } from 'react'
import { StyledTable, StyledTableProps } from './styles'
import { AlephNode } from '@/domain/node'

export const NodesTable = <T extends AlephNode>({
  children,
  ...rest
}: StyledTableProps<T>) => {
  return (
    <div tw="max-w-full overflow-x-auto">
      <StyledTable {...rest}>{children}</StyledTable>
    </div>
  )
}
NodesTable.displayName = 'NodesTable'

export default memo(NodesTable) as typeof NodesTable
