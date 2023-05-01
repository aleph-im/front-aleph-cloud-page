import { StyledExternalLinkButton } from './styles'
import { ExternalLinkButtonProps } from './types'
import { Icon } from '@aleph-front/aleph-core'

export default function ExternalLinkButton({
  children,
  href,
  size = 'big',
  ...rest
}: ExternalLinkButtonProps) {
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
