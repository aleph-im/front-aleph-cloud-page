import tw from 'twin.macro'
import styled, { css } from 'styled-components'

export const StyledDotIcon = styled.div<{ $active: boolean }>(
  ({ theme, $active }) => {
    const color = $active ? theme.color.success : theme.color.disabled2

    return [
      tw`h-3 w-2`,
      css`
        background-color: ${color};
      `,
    ]
  },
)
