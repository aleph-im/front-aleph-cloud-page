import { addClasses, Button, Icon } from '@aleph-front/aleph-core'
import styled, {
  css,
} from 'styled-components'
import tw from 'twin.macro'

export const StyledFooter = styled.footer`
  ${tw`py-12 md:py-12`}
  background-color: #00000033;
  box-sizing: border-box;
  width: 100%;
`

export const StyledButton = styled(Button).attrs(props => {
  return {
    ...props,
    kind: 'neon',
    variant: 'tertiary',
    color: 'main0',
    size: 'big',
  }
})`
  ${tw`mb-6`}
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
    ...props,
    size: 'lg',
  }
})(() => [tw`mr-2.5`])

export const StyledIcon2 = styled(Icon).attrs(props => {
  return {
    ...props,
    size: 'lg',
  }
})(() => [tw`ml-2.5`])
