import styled, { css } from 'styled-components'
import tw from 'twin.macro'

type StyledHoldingSummaryLineProps = {
  isHeader?: boolean
}

export const StyledHoldingSummaryLine = styled.div<StyledHoldingSummaryLineProps>`
  ${({ isHeader }) => css`
    ${tw`p-0 grid`}
    grid-template-columns: 1fr 2fr 1fr;
    grid-auto-rows: max-content;
    opacity: ${isHeader ? 0.5 : 1};
    margin-bottom: ${isHeader ? '1.5rem' : '0'};
    align-items: stretch;

    & > * {
      ${tw`px-4 py-3`}
      width: 100%;
      border-bottom: 1px solid #666;

      &:first-child {
        ${tw`flex flex-col items-start justify-center text-xs `}
      }

      &:not(:first-child) {
        ${tw`flex flex-col items-end justify-center`}
      }

      &:last-child {
        border-bottom-style: dashed;
      }
    }
  `}
`
