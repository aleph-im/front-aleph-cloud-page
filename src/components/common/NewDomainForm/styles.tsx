import styled from 'styled-components'
import tw from 'twin.macro'

export const StyledSection = styled.section<{ $isEmbedded?: boolean }>`
  ${tw`p-0`}
  ${({ $isEmbedded }) => !$isEmbedded && tw`pt-20 pb-6 md:py-10`}
`
