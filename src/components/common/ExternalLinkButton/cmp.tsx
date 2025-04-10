import { memo } from 'react'
import { StyledExternalLinkButton } from './styles'
import { ExternalLinkButtonProps } from './types'
import { Icon } from '@aleph-front/core'

export const ExternalLinkButton = ({
  children,
  href,
  size = 'md',
  ...rest
}: ExternalLinkButtonProps) => {
  return (
    <>
      <StyledExternalLinkButton
        href={href}
        size={size}
        {...rest}
        target="_blank"
      >
        {children ? children : href}
        <Icon name="square-up-right" tw="ml-2.5" />
      </StyledExternalLinkButton>
    </>
  )
}
ExternalLinkButton.displayName = 'ExternalLinkButton'

export default memo(ExternalLinkButton)
