import { AlephNode } from '@/domain/node'
import { TableProps } from '@aleph-front/core'
import styled from 'styled-components'
import tw from 'twin.macro'
import Table from '../Table'

export type StyledTableProps<T extends AlephNode> = Omit<
  TableProps<T>,
  'borderType' | 'oddRowNoise' | 'stickyHeader'
>

export const StyledTable = styled(Table as any).attrs(
  (props: StyledTableProps<any>) => {
    return {
      borderType: 'solid',
      oddRowNoise: true,
      stickyHeader: false,
      ...props,
    }
  },
)`
  thead th {
    font-size: 0.8125rem;
    ${tw`whitespace-nowrap`}
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
