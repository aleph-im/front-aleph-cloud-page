import styled, { css } from 'styled-components'
import { Table } from '@aleph-front/aleph-core'
import { SpecsDetail } from './types'

export const StyledTable = styled(Table<SpecsDetail>)`
  ${({ theme }) => css`
    tbody {
      tr {
        cursor: pointer;
        &:hover {
          color: ${theme.color.main0};
        }
      }
    }
  `}
`
