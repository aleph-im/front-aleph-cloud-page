import { memo } from 'react'
import { ExternalLinkButtonProps } from './types'
import { Button, Icon } from '@aleph-front/core'

export const ExternalLinkButton = ({
  children,
  href,
  size = 'md',
  variant = 'textOnly',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forwardedAs,
  ...rest
}: ExternalLinkButtonProps) => {
  return (
    <Button
      as="a"
      href={href}
      size={size}
      kind="default"
      variant={variant}
      color="main0"
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children ? children : href}
      <Icon name="square-up-right" tw="ml-2.5" />
    </Button>
  )
}
ExternalLinkButton.displayName = 'ExternalLinkButton'

export default memo(ExternalLinkButton)
