import styled from 'styled-components'
import tw from 'twin.macro'
import CenteredContainer from '@/components/common/CenteredContainer'

export const Separator = styled.hr`
  ${tw`my-5`}
  border: 0;
  border-top: 1px solid #fff;
  opacity: 0.25;
`

// @todo: Refactor adding new text color in core?
export const GrayText = styled.span`
  color: ${({ theme }) => theme.color.text}b3;
`

export const Container = styled(CenteredContainer).attrs((props) => ({
  ...props,
  variant: 'dashboard',
}))``
