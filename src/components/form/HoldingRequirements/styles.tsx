import { Icon, addClasses } from '@aleph-front/aleph-core'
import styled, { css, keyframes } from 'styled-components'
import tw from 'twin.macro'

type StyledHoldingSummaryLineProps = {
  isHeader?: boolean
}

export const StyledHoldingSummaryLine = styled.div<StyledHoldingSummaryLineProps>`
  ${({ isHeader }) => css`
    ${tw`p-0 grid`}
    grid-template-columns: 1fr 2fr 1fr;
    grid-auto-rows: max-content;
    opacity: ${isHeader ? 0.5 : 1};
    margin-bottom: ${isHeader ? '1.5rem' : '0'};
    align-items: stretch;

    & > * {
      ${tw`px-4 py-3`}
      width: 100%;
      border-bottom: 1px solid #666;

      &:first-child {
        ${tw`flex flex-col items-start justify-center text-xs `}
      }

      &:not(:first-child) {
        ${tw`flex flex-col items-end justify-center`}
      }

      &:last-child {
        border-bottom-style: dashed;
      }
    }
  `}
`

export const GreyLabel = styled.span.attrs(addClasses('tp-info'))`
  color: rgba(255, 255, 255, 0.3);
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
