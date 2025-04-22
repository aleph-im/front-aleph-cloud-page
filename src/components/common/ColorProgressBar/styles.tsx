import tw from 'twin.macro'
import styled, { css } from 'styled-components'

export type StyledProgressBarProps = {
  $percent: number
  $color?: string
  $gradient?: string
}

export const StyledProgressBar = styled.div<StyledProgressBarProps>(
  ({ theme, $color = 'main0', $gradient, $percent }) => {
    const gradient = $gradient ? theme.gradient[$gradient]?.fn : undefined
    const color = gradient || theme.color[$color] || $color
    const bgColor = theme.color.disabled2

    return [
      tw`relative h-0.5 w-full`,
      css`
        background-color: ${bgColor};

        &:after {
          ${tw`absolute top-0 left-0 h-full`}
          content: '';
          background-color: ${color};
          width: ${$percent * 100}%;
        }
      `,
    ]
  },
)
