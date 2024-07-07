import styled, { css } from 'styled-components'

export const StyledInformationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.75rem;

  ${({ theme }) => css`
    background: ${theme.color.base1};
  `}
`
