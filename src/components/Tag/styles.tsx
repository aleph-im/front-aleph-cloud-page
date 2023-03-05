import styled, { css } from 'styled-components'

export const StyledTag = styled.span.attrs(props => {
  return {
    ...props,
    className: `${props.className || ''} fx-glass-base1 fx-glass-border-base0` as string
  }
})`
  ${({ theme }) => {
    return css`
      box-sizing: border-box;
      display: inline-block;
      padding: 0.5rem 1.125rem;
      color: ${theme.color.text};
      margin: 0 auto;
      border-radius: 0.5rem;
    `
  }}
`
