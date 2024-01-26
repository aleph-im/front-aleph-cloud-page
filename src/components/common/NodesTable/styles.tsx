import { AlephNode } from '@/domain/node'
import { TableProps } from '@aleph-front/core'
import styled from 'styled-components'
import tw from 'twin.macro'
import Table from '../Table'

export type StyledTableProps<T extends AlephNode> = Omit<
  TableProps<T>,
  'borderType' | 'rowNoise' | 'stickyHeader'
>

export const StyledTable = styled(Table as any).attrs(
  (props: StyledTableProps<any>) => {
    return {
      borderType: 'solid',
      rowNoise: true,
      stickyHeader: false,
      ...props,
    }
  },
)`
  thead th {
    font-size: 0.8125rem;
    ${tw`whitespace-nowrap`}
  }

  tbody tr {
    cursor: default;
  }

  td,
  th {
    padding: 0.75rem 1rem;
    width: 0;
  }

  tr,
  td {
    border: none;
  }
`
