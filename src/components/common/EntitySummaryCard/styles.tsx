import styled, { css } from 'styled-components'

export const StyledEntitySummaryCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  min-width: 15rem;

  ${({ theme }) => css`
    background: ${theme.color.purple0};
  `};
`
