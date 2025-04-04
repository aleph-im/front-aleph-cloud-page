import { Icon } from '@aleph-front/core'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledCopytoClipboardIcon = styled(Icon)`
  ${({ theme }) => css`
    ${tw`cursor-pointer`}
    transition-property: color;
    transition-duration: ${theme.transition.duration.fast}ms;
    transition-timing-function: ${theme.transition.timing};

    &:hover {
      color: ${theme.color.main0};
    }
  `}
`
