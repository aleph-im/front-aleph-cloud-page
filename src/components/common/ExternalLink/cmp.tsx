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
        {...props}
      >
        {text ? text : href}
        <Icon name="square-up-right" tw="ml-2.5" />
      </StyledExternalLink>
    </>
  )
}
ExternalLink.displayName = 'ExternalLink'

export default memo(ExternalLink) as typeof ExternalLink
