import tw from 'twin.macro'
import styled, { css } from 'styled-components'
import { Table, addClasses } from '@aleph-front/core'
import { SpecsDetail } from './types'

export const StyledTable = styled(Table<SpecsDetail>).attrs(
  addClasses('tp-body3'),
)`
  ${({ theme }) => {
    const { duration, timing } = theme.transition

    return css`
      tbody {
        tr {
          cursor: pointer;
          transition: background ${timing} ${duration.fast}ms 0ms;

          & td {
            &:first-child {
              border-top-left-radius: 3.75rem;
              border-bottom-left-radius: 3.75rem;
            }

            &:last-child {
              border-top-right-radius: 3.75rem;
              border-bottom-right-radius: 3.75rem;
            }
          }

          &:hover {
            color: ${theme.color.main0};
          }

          &._active {
            color: ${theme.color.main0};
            background-color: ${theme.color.purple4};
            cursor: not-allowed;
          }

          &._disabled {
            color: ${theme.color.disabled};
            opacity: 0.8;
            cursor: not-allowed;
          }
        }
      }

      & td,
      & th {
        ${tw`px-4 w-0 whitespace-nowrap text-ellipsis`}
      }
    `
  }}
`
