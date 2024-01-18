import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export type StyledContainerProps = {
  $variant?: 'xl' | 'lg' | 'md'
}

export const widthVariant = {
  xl: 90, // @note: 1440px max-width
  lg: 60.0625, // @note: 961px max-width
  md: 44.6875, // @note: 715px max-width
}

export const StyledContainer = styled.div<StyledContainerProps>`
  ${({ $variant = 'lg' }) => {
    return css`
      ${tw`px-5 md:px-16 pb-16 mx-auto w-full`}
      max-width: ${widthVariant[$variant]}rem;
    `
  }}
`

export default StyledContainer
