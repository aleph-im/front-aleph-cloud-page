import { addClasses, Button, Icon } from '@aleph-front/aleph-core'
import styled, {
  css,
} from 'styled-components'

export const StyledFooter = styled.footer.attrs(addClasses('py-xxl py-xxl-md'))`
  background-color: #00000033;
  box-sizing: border-box;
  width: 100%;
`

export const StyledButton = styled(Button).attrs(props => {
  return {
    ...addClasses('mb-lg')(props),
    kind: 'neon',
    variant: 'tertiary',
    color: 'main0',
    size: 'big',
  }
})`
  display: block;
  
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const StyledLink = styled.a.attrs(props => {
  return {
    ...addClasses('tp-nav')(props),
    href: props.href || '#',
  }
})`
  ${({ theme }) => css`
    display: block;
    cursor: pointer;
    font-weight: 700;
    white-space: nowrap;
    
    color: ${theme.color.text};
    text-decoration: none;

    &:last-child {
      margin-bottom: 0;
    }
  `}
`

export const StyledIcon = styled(Icon).attrs(props => {
  return {
    ...addClasses('mr-xs')(props),
    size: 'lg',
  }
})``


export const StyledIcon2 = styled(Icon).attrs(props => {
  return {
    ...addClasses('ml-xs')(props),
    size: 'lg',
  }
})``