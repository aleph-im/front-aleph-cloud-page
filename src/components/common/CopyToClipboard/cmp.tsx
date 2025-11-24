import { memo } from 'react'
import { Icon, useCopyToClipboardAndNotify } from '@aleph-front/core'
import { StyledCopytoClipboard } from './styles'
import { CopyToClipboardProps } from './types'

export const CopytoClipboardIcon = ({
  text,
  textToCopy,
}: CopyToClipboardProps) => {
  const handleCopy = useCopyToClipboardAndNotify(textToCopy || '')

  return (
    <StyledCopytoClipboard onClick={handleCopy}>
      {text}
      <Icon name="copy" />
    </StyledCopytoClipboard>
  )
}
CopytoClipboardIcon.displayName = 'CopytoClipboardIcon'

export default memo(CopytoClipboardIcon)
