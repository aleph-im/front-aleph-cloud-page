import { memo, useEffect, useRef, useState } from 'react'
import { StyledInfoTooltipButton } from './styles'
import { InfoTooltipButtonProps } from './types'
import { Icon, Tooltip } from '@aleph-front/core'
import tw from 'twin.macro'
import { TwStyle } from 'twin.macro'

export const InfoTooltipButton = ({
  children,
  tooltipContent,
  plain,
  align = 'right',
  vAlign = 'center',
  iconSize = '1em',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forwardedAs,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  as,
  ...rest
}: InfoTooltipButtonProps) => {
  // Wait until after client-side hydration to show
  const [renderTooltip, setRenderTooltip] = useState(false)
  useEffect(() => {
    setRenderTooltip(true)
  }, [])

  const targetRef = useRef<HTMLButtonElement>(null)

  const iconCss: (TwStyle | string)[] = []
  switch (align) {
    case 'left':
      iconCss.push(tw`-order-1`)
      break
  }
  switch (vAlign) {
    case 'top':
      iconCss.push(tw`mb-2`)
      break
    case 'bottom':
      iconCss.push(tw`-mb-1`)
      break
  }

  const iconElm = <Icon name="info-circle" size={iconSize} css={iconCss} />

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
        <Tooltip {...rest} targetRef={targetRef} content={tooltipContent} />
      )}
    </>
  )
}
InfoTooltipButton.displayName = 'InfoTooltipButton'

export default memo(InfoTooltipButton) as typeof InfoTooltipButton
