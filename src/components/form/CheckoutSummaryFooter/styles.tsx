import tw from 'twin.macro'
import styled from 'styled-components'

export const StyledSeparator = styled.div`
  ${tw`hidden md:block`}
  flex: 0 0 1px;
  background-color: ${({ theme }) => theme.component.walletPicker.border.color};
`
