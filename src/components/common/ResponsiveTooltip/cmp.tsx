import { memo } from 'react'
import { Tooltip, TooltipProps, useResponsiveMax } from '@aleph-front/core'
import tw from 'twin.macro'

export const ResponsiveTooltip = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forwardedAs,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  as,
  ...rest
}: TooltipProps) => {
  const isMobile = useResponsiveMax('md')
  const css = isMobile
    ? tw`!fixed !left-0 !top-0 !transform-none m-6 !z-20 !w-[calc(100% - 3rem)] !h-[calc(100% - 3rem)] !max-w-full`
    : ''

  return <Tooltip {...rest} css={css} />
}
ResponsiveTooltip.displayName = 'ResponsiveTooltip'

export default memo(ResponsiveTooltip) as typeof ResponsiveTooltip
