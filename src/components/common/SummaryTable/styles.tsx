import { Table } from '@aleph-front/core'
import { ReactNode } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'

export const StyledTable = styled(
  Table<{ name: string; value: ReactNode }>,
).attrs((props) => {
  return {
    ...props,
    borderType: 'solid',
    stickyHeader: false,
  }
})`
  && {
    thead {
      ${tw`hidden`}
    }

    td,
    th {
      ${tw`w-0 whitespace-nowrap text-ellipsis overflow-hidden px-4 py-3`}
      border-bottom: 1px solid #ffffff22;

      &:first-child {
        ${tw`w-2/3 max-w-0 text-12 uppercase`}
      }

      &:last-child {
        ${tw`text-right`}
      }
    }
  }
`
