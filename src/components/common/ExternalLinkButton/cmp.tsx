import { memo } from 'react'
import { StyledExternalLinkButton } from './styles'
import { ExternalLinkButtonProps } from './types'
import { Icon } from '@aleph-front/core'

export const ExternalLinkButton = ({
  children,
  href,
  ...rest
}: ExternalLinkButtonProps) => {
  return (
    <>
      <StyledExternalLinkButton
        {...{
          href,
          target: '_blank',
          ...rest,
        }}
        tw="inline-flex items-center gap-2.5"
      >
        {children ? children : href}
        <Icon name="square-up-right" />
      </StyledExternalLinkButton>
    </>
  )
}
ExternalLinkButton.displayName = 'ExternalLinkButton'

export default memo(ExternalLinkButton) as typeof ExternalLinkButton
