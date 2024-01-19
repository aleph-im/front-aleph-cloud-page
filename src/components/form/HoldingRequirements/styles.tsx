import { Icon, addClasses } from '@aleph-front/core'
import styled, { css, keyframes } from 'styled-components'
import tw from 'twin.macro'

type StyledHoldingSummaryLineProps = {
  $isHeader?: boolean
}

export const StyledHoldingSummaryLine = styled.div<StyledHoldingSummaryLineProps>`
  ${({ theme, $isHeader }) => css`
    ${tw`p-0 grid`}
    grid-template-columns: 1fr 2fr 1fr;
    grid-auto-rows: max-content;
    align-items: stretch;

    > * {
      ${tw`px-4 py-3`}
      width: 100%;
      border-bottom: 0.0625rem solid ${theme.color.purple2};

      & {
        ${tw`flex flex-col items-end justify-center`}
      }

      &:first-child {
        ${tw`items-start`}
        font-size: ${theme.font.size[12]}rem;
      }

      &:last-child {
        font-weight: 700;
        border-bottom-style: dashed;
      }

      ${$isHeader &&
      css`
        font-weight: 700;
        font-size: ;
        border-bottom: none !important;
      `}
    }
  `}
`

export const Label = styled.span.attrs(addClasses('tp-info'))`
  color: ${({ theme }) => theme.color.base2};
`

export const BlueLabel = styled.span.attrs(addClasses('tp-info text-main0'))``

const transfer1 = keyframes` 
  0%  {
    opacity: 0;
    transform: translate3d(-100%,0,0);
  }
 
  50% {
    opacity: 1;
    transform: translate3d(0,0,0);
  }

  100% {
    opacity: 0;
    transform: translate3d(100%,0,0);
  }
`

export const StyledArrowIcon = styled(Icon).attrs((props) => {
  return {
    ...props,
    name: 'angle-double-right',
    size: '1.5',
  }
})`
  ${tw`p-1 origin-center`}
  animation: 1000ms linear 0ms infinite ${transfer1};
`
