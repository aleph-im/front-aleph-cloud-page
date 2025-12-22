import styled from 'styled-components'
import tw from 'twin.macro'
import { addClasses } from '@aleph-front/core'

export const Separator = styled.hr`
  ${tw`my-5`}
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.color.main0};
  opacity: 0.3;
`

export const Text = styled.span.attrs(addClasses('tp-body1 text-text'))``
export const DisabledText = styled.span.attrs(
  addClasses('tp-body1 text-disabled'),
)``
