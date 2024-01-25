import tw from 'twin.macro'
import styled, { css } from 'styled-components'
import { Table, addClasses } from '@aleph-front/core'

export const StyledTable = styled(Table<any>).attrs(addClasses('tp-body3'))`
  ${({ theme }) => {
    const { duration, timing } = theme.transition

    return css`
      thead {
        color: ${theme.color.text};
        background-color: ${theme.color.purple0};
        border-bottom: 0.125rem solid ${theme.color.white};
        th > div {
          opacity: 1 !important;
        }
      }

      tbody {
        tr {
          cursor: pointer;
          transition: all ${timing} ${duration.fast}ms 0ms;

          td {
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

      td,
      th {
        ${tw`px-4 w-0 whitespace-nowrap text-ellipsis`}
      }

      && {
        .check-button {
          background: ${theme.color.purple0};
          color: ${theme.color.main0};
          width: 3.75rem;
          height: 2rem;
          min-height: 2rem;

          &::after {
            display: none;
          }
        }
      }
    `
  }}
`

export default StyledTable
