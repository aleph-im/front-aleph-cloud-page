import { Tooltip } from '@aleph-front/core'
import styled from 'styled-components'
import tw from 'twin.macro'

export type StyledResponsiveTooltipProps = {
  $isMobile: boolean
}

export const StyledResponsiveTooltip = styled(
  Tooltip,
).attrs<StyledResponsiveTooltipProps>(({ $isMobile, ...tooltipProps }) => {
  const css = $isMobile
    ? tw`!absolute !top-0 !left-0 !transform-none !z-50 !w-[calc(100% - 3rem)] !h-[calc(100% - 3rem)] !max-w-full !m-48`
    : ''

  return {
    ...tooltipProps,
    css,
  }
})<StyledResponsiveTooltipProps>``

// <StyledResponsiveTooltipProps>`
//   ${({ $isMobile }) => css`
//     ${$isMobile &&
//     tw`!absolute !top-0 !left-0 !transform-none !z-50 !w-[calc(100% - 3rem)] !h-[calc(100% - 3rem)] !max-w-full !text-red-50 !bg-red-500`}

//     ${tw`!p-12`}
//   `}
// `
