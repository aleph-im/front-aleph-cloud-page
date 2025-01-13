import styled, { css } from 'styled-components'
import tw from 'twin.macro'

type StyledSliderContentProps = {
  showLogs: boolean
}

export const StyledSliderContent = styled.div<StyledSliderContentProps>`
  ${tw`flex transition-transform duration-1000 w-[200%]`}

  ${({ showLogs }) =>
    showLogs
      ? css`
          ${tw`-translate-x-1/2`}
        `
      : css`
          ${tw`translate-x-0`}
        `}
`
