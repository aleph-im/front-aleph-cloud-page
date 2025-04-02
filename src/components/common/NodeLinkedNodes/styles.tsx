import tw from 'twin.macro'
import styled, { css } from 'styled-components'

export const StyledDotIcon = styled.div<{ $score?: number }>(
  ({ theme, $score }) => {
    const color =
      $score === undefined
        ? theme.color.disabled2
        : $score >= 0.8
          ? theme.color.success
          : $score >= 0.5
            ? theme.color.info
            : theme.color.error

    return [
      tw`h-3 w-2`,
      css`
        background-color: ${color};
      `,
    ]
  },
)
