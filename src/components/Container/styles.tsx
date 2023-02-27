import styled, { css } from 'styled-components'

export const StyledContainer = styled.div.attrs(props => {
  return {
    ...props,
    className: `${props.className || ''} px-xs-xs px-sm-sm px-md-md px-lg-lg px-xl-xl px-xxl-xxl`
  }
})`
  ${({ theme }) => {
    return css`
      box-sizing: border-box;
      width: 100%;
      margin: 0 auto;
      max-width: ${theme.breakpoint.xxl}rem;
    `
  }}
`
