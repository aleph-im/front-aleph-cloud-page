import styled, { css } from 'styled-components'

type StyledHoldingSummaryLineProps = {
  isHeader?: boolean
}

export const StyledHoldingSummaryLine = styled.div<StyledHoldingSummaryLineProps>`
  ${({ isHeader }) => css`
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-auto-rows: max-content;
    opacity: ${isHeader ? 0.5 : 1};
    margin-bottom: ${isHeader ? '1rem' : '0'};
    justify-self: start;

    & > * {
      padding: 1rem 0;
      width: 100%;
      border-bottom: 1px solid #666;

      &:not(:first-child) {
        text-align: right;
      }
      &:last-child {
        border-bottom-style: dashed;
      }
    }
  `}
`
