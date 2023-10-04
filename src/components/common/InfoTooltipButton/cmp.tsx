import { useEffect, useRef, useState } from 'react'
import { StyledInfoTooltipButton } from './styles'
import { InfoTooltipButtonProps } from './types'
import { Icon, Tooltip, useResponsiveMax } from '@aleph-front/aleph-core'
import tw from 'twin.macro'

export default function InfoTooltipButton({
  children,
  tooltipContent,
  plain,
  align = 'right',
  vAlign = 'center',
  ...rest
}: InfoTooltipButtonProps) {
  // @note: https://reactjs.org/link/uselayouteffect-ssr
  // Wait until after client-side hydration to show
  const [renderTooltip, setRenderTooltip] = useState(false)
  useEffect(() => {
    setRenderTooltip(true)
  }, [])

  const targetRef = useRef<HTMLButtonElement>(null)

  // @todo: Improve this using css
  const isMobile = useResponsiveMax('md')
  const mobileTw = isMobile
    ? tw`!fixed !left-0 !top-0 !transform-none m-6 !z-20 !w-[calc(100% - 3rem)] !h-[calc(100% - 3rem)] !max-w-full`
    : tw``

  const alignClass = align === 'left' ? tw`-order-1` : ''
  const vAlignClass = vAlign === 'top' ? tw`mb-2` : ''
  const iconCss = [alignClass, vAlignClass]

  const iconElm = <Icon name="info-circle" css={iconCss} />

  return (
    <>
      {plain ? (
        <span ref={targetRef} tw="cursor-help inline-flex items-center gap-2.5">
          {children}
          {iconElm}
        </span>
      ) : (
        <StyledInfoTooltipButton
          ref={targetRef}
          tw="inline-flex items-center gap-2.5"
        >
          {children}
          {iconElm}
        </StyledInfoTooltipButton>
      )}
      {renderTooltip && (
        <Tooltip
          {...rest}
          targetRef={targetRef}
          content={tooltipContent}
          css={mobileTw}
        />
      )}
    </>
  )
}
