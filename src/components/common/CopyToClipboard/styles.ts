import { Icon } from '@aleph-front/core'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledCopytoClipboard = styled.div`
  ${({ theme }) => css`
    ${tw`cursor-pointer flex gap-x-2 items-center`}
    transition-property: color;
    transition-duration: ${theme.transition.duration.fast}ms;
    transition-timing-function: ${theme.transition.timing};

    &:hover {
      color: ${theme.color.main0};
    }

    &:hover ${StyledIcon} {
      color: ${theme.color.main0};
    }
  `}
`

export const StyledIcon = styled(Icon)<{ $color: string }>`
  ${({ theme, $color }) => css`
    color: ${theme.color[$color]};

    transition-property: color;
    transition-duration: ${theme.transition.duration.fast}ms;
    transition-timing-function: ${theme.transition.timing};
  `}
`
