import tw from 'twin.macro'
import styled, { css, keyframes } from 'styled-components'
import { Table, addClasses } from '@aleph-front/core'
import { StyledTableProps } from './types'

const heartbeat = keyframes`
  0%, 100% { transform: translateY(-50%) scale(1); }
  14% { transform: translateY(-50%) scale(1.08); }
  28% { transform: translateY(-50%) scale(1); }
  42% { transform: translateY(-50%) scale(1.05); }
  56% { transform: translateY(-50%) scale(1); }
`

export const StyledTable = styled(Table<any>).attrs(
  addClasses('tp-body3'),
)<StyledTableProps>`
  ${({
    theme,
    clickableRows = false,
    rowBackgroundColors = ['light0', 'purple1'],
    hoverHighlight = true,
  }) => {
    const { duration, timing } = theme.transition
    const [color1, color2] = rowBackgroundColors

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

      border-collapse: separate;
      border-spacing: 0 1rem;

      thead {
        color: ${theme.color.text};
        background: ${({ theme }) => theme.color.purple1};

        th > div {
          opacity: 1 !important;
        }
      }

      tbody {
        tr {
          cursor: ${clickableRows ? 'pointer' : 'default'};
          background: ${theme.color[color2]};
          height: 4rem;

          td {
            transition: all ${timing} ${duration.fast}ms 0ms;
            background: ${theme.color[color1]};

            &.fx-noise-light {
              background: ${theme.color.light1};
            }
          }

          &:hover,
          &._active {
            .check-button {
              visibility: visible;
              opacity: 1;
            }
          }

          ${hoverHighlight &&
          css`
            &:hover {
              td {
                background: ${theme.color.purple4}50;
              }
            }
          `}

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

          &._spotlight {
            position: relative;
            box-shadow: 0px 4px 24px ${theme.color.main0}26;
            border-radius: 0.5rem;

            td {
              box-shadow:
                inset 0 4px 0 0 ${theme.color.purple4},
                inset 0 -4px 0 0 ${theme.color.purple4};
            }

            td:first-child {
              border-radius: 0.5rem 0 0 0.5rem;
              box-shadow:
                inset 4px 0 0 0 ${theme.color.purple4},
                inset 0 4px 0 0 ${theme.color.purple4},
                inset 0 -4px 0 0 ${theme.color.purple4};
            }

            td:last-child {
              border-radius: 0 0.5rem 0.5rem 0;
              box-shadow:
                inset -4px 0 0 0 ${theme.color.purple4},
                inset 0 4px 0 0 ${theme.color.purple4},
                inset 0 -4px 0 0 ${theme.color.purple4};
            }

            .spotlight-label {
              position: absolute;
              left: 0.5rem;
              top: 0;
              transform: translateY(-50%);
              background: ${theme.color.purple0};
              color: ${theme.color.error};
              border: 4px solid ${theme.color.error};
              font-family: ${theme.font.family.head};
              font-size: 0.75rem;
              font-weight: 800;
              font-style: italic;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              padding: 0.25rem 0.75rem;
              border-radius: 1rem;
              white-space: nowrap;
              pointer-events: none;
              z-index: 1;
              animation: ${heartbeat} 1.8s ease-in-out infinite;
            }
          }
        }
      }

      td,
      th {
        ${tw`py-1 px-6 w-0 whitespace-nowrap text-ellipsis`}
      }
    `
  }}
`

export default StyledTable
