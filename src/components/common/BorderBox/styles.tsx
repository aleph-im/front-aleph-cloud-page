import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const BorderBox = styled.div<{
  $color: string
}>`
  ${({ theme, $color = 'main0' }) => {
    const [g0, g1] = theme.gradient[$color]?.colors || [$color, $color]

    return css`
      ${tw`p-6`}
      border-radius: 1.5rem;
      backdrop-filter: blur(50px);
      color: ${theme.color.text}b3;

      background: linear-gradient(90deg, ${g0}1a 0%, ${g1}1a 100%);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        border-radius: 1.5rem;
        z-index: -1;
        padding: 1px;

        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: exclude;
        mask-composite: exclude;
        -webkit-mask-composite: xor;

        background-image: linear-gradient(90deg, ${g0} 0%, ${g1} 100%);
      }
    `
  }}
`

export default BorderBox
