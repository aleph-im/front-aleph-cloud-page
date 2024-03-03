import { Icon } from '@aleph-front/core'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledContainer = styled.div`
  ${({ theme }) => {
    return css`
      ${tw`flex items-center cursor-pointer`}

      ${StyledIcon} {
        color: ${theme.color.purple4};
      }

      &:hover ${StyledIcon} {
        color: ${theme.color.main0};
      }
    `
  }}
`

export const StyledIcon = styled(Icon)`
  ${({ theme }) => css`
    ${tw`cursor-pointer ml-2`}
    transition-property: color;
    transition-duration: ${theme.transition.duration.fast}ms;
    transition-timing-function: ${theme.transition.timing};
  `}
`
