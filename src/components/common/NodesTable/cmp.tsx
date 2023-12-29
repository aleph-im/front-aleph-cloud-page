import { memo } from 'react'
import { StyledTable, StyledTableProps } from './styles'
import { AlephNode, CCN, CRN } from '@/domain/node'

export type NodesTableProps<T extends AlephNode> = T extends CRN
  ? StyledTableProps<CRN>
  : StyledTableProps<CCN>

export const NodesTable = <T extends AlephNode>({
  children,
  ...rest
}: NodesTableProps<T>) => {
  return (
    <div tw="max-w-full overflow-x-auto">
      <StyledTable {...rest}>{children}</StyledTable>
    </div>
  )
}
NodesTable.displayName = 'NodesTable'

export default memo(NodesTable) as typeof NodesTable
