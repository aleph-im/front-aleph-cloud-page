import { ReactNode, memo } from 'react'
import Link from 'next/link'
import { Icon } from '@aleph-front/core'
import CopyToClipboardIcon from '../CopyToClipboardIcon'

export type NodeDetailLinkProps = {
  href?: string
  children?: ReactNode
  isOwner?: boolean
  textToCopy?: string
}

export const NodeDetailLink = ({
  href,
  children,
  isOwner,
  textToCopy,
  ...rest
}: NodeDetailLinkProps) => {
  const content = (
    <span tw="flex-1 whitespace-nowrap text-ellipsis overflow-hidden">
      {children || 'NONE'}
    </span>
  )

  return (
    <div tw="flex items-center gap-2">
      {href ? (
        <Link
          href={href}
          target="_blank"
          {...rest}
          tw="flex items-center gap-2 min-w-0 w-full"
        >
          {content}
          {!isOwner && (
            <Icon tw="w-3.5 h-3.5" name="external-link-square-alt" />
          )}
        </Link>
      ) : (
        <span tw="flex items-center w-full">{content}</span>
      )}
      {textToCopy && <CopyToClipboardIcon text={textToCopy} />}
    </div>
  )
}
NodeDetailLink.displayName = 'NodeDetailLink'

export default memo(NodeDetailLink)
