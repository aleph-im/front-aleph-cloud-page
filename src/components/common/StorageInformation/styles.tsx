import styled, { css } from 'styled-components'

export const StyledStorageInformationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => css`
    background: ${theme.color.base1};
  `}
`
