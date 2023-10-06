import styled from 'styled-components'
import tw from 'twin.macro'

export const StyledToggleContainer = styled.div<{ $height?: string }>`
  ${tw`transition-all duration-700 overflow-auto`}
  height: ${({ $height }) => $height};
`
