import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledToggleContainer = styled.div<{ $open: boolean }>`
  ${tw`transition-all duration-700`}
  ${({ $open }) => ($open ? tw`max-h-[9999px]` : tw`max-h-0 overflow-hidden`)}
`
