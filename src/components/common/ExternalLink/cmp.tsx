import { memo } from 'react'
import { StyledExternalLink } from './styles'
import { ExternalLinkProps } from './types'
import { Icon } from '@aleph-front/core'

export const ExternalLink = ({
  text,
  href,
  color,
  typo,
  underline,
  disabled = false,
  ...props
}: ExternalLinkProps) => {
  return (
    <>
      <StyledExternalLink
        href={href}
        target="_blank"
        $color={color}
        $typo={typo}
        $underline={underline}
        $disabled={disabled}
        {...props}
      >
        {text ? text : href}
        <Icon name="square-up-right" tw="ml-1" />
      </StyledExternalLink>
    </>
  )
}
ExternalLink.displayName = 'ExternalLink'

export default memo(ExternalLink) as typeof ExternalLink
