import styled, { css } from 'styled-components'

export const StyledPicker = styled.div`
  ${({ theme }) => {
    const { background, shadow } = theme.component.walletPicker

    return css`
      position: relative;
      min-width: 20rem;
      border-radius: 1.875rem;
      background: ${background};
      z-index: 1;
      padding: 1.5rem;
      box-shadow: ${shadow};
      backdrop-filter: blur(50px);
    `
  }}
`

export const StyledLine = styled.div`
  ${({ theme }) => {
    const { border } = theme.component.walletPicker

    return css`
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: ${border.size}rem solid ${border.color};
    `
  }}
`
