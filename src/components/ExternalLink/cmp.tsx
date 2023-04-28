import { StyledExternalLink } from './styles'
import { ExternalLinkProps } from './types'
import { Icon } from '@aleph-front/aleph-core'

export default function ExternalLink({ text, href }: ExternalLinkProps) {
  return (
    <>
      <StyledExternalLink href={href} target="_blank">
        {text ? text : href}
      </StyledExternalLink>
      &nbsp;
      <Icon name="square-up-right" />
    </>
  )
}
