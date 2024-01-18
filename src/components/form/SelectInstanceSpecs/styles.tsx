import tw from 'twin.macro'
import styled, { css } from 'styled-components'
import { Table } from '@aleph-front/core'
import { SpecsDetail } from './types'

export const StyledTable = styled(Table<SpecsDetail>)`
  ${({ theme }) => css`
    tbody {
      tr {
        cursor: pointer;
        &:hover {
          color: ${theme.color.main0};
        }

        &.disabled {
          color: ${theme.color.base0};
          opacity: 0.3;
          cursor: not-allowed;
        }
      }
    }

    & td,
    & th {
      ${tw`px-4 w-0 whitespace-nowrap text-ellipsis`}
    }
  `}
`
