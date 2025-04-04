import tw from 'twin.macro'
import styled, { css } from 'styled-components'
import { Table, addClasses } from '@aleph-front/core'

export const StyledTable = styled(Table<any>).attrs(addClasses('tp-body3'))`
  ${({ theme }) => {
    const { duration, timing } = theme.transition

    return css`
      .check-button {
        transition: all ${timing} ${duration.fast}ms 0ms;

        background: ${theme.color.purple0};
        color: ${theme.color.main0};
        width: 3.75rem;
        height: 2rem;
        min-height: 2rem;

        visibility: hidden;
        opacity: 0;

        &::after {
          display: none;
        }

        &:disabled {
          background: ${theme.color.purple0};
        }
      }

      thead {
        color: ${theme.color.text};
        background: ${({ theme }) => theme.color.light0};
        border-bottom: 0.125rem solid ${theme.color.white};
        th > div {
          opacity: 1 !important;
        }
      }

      tbody {
        tr {
          cursor: pointer;

          td {
            transition: all ${timing} ${duration.fast}ms 0ms;
            background: ${theme.color.light0};

            &.fx-noise-light {
              background: ${theme.color.light1};
            }
          }

          &:hover,
          &._active {
            td {
              color: ${theme.color.main0};

              &:first-child {
                border-top-left-radius: 3.75rem;
                border-bottom-left-radius: 3.75rem;
              }

              &:last-child {
                border-top-right-radius: 3.75rem;
                border-bottom-right-radius: 3.75rem;
              }
            }

            .check-button {
              visibility: visible;
              opacity: 1;
            }
          }

          &:hover {
            td {
              background: ${theme.color.purple4}50;
            }
          }

          &._active {
            cursor: not-allowed;

            td {
              background: ${theme.color.purple4};
            }
          }

          &._disabled {
            td {
              color: ${theme.color.disabled};
              background: inherit;
              opacity: 0.8;
              cursor: not-allowed;
            }
          }
        }
      }

      td,
      th {
        ${tw`px-4 w-0 whitespace-nowrap text-ellipsis`}
      }
    `
  }}
`

export default StyledTable
