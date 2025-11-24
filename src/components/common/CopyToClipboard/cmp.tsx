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
    <StyledCopytoClipboard>
      {text}
      <Icon name="copy" onClick={handleCopy} />
    </StyledCopytoClipboard>
  )
}
CopytoClipboardIcon.displayName = 'CopytoClipboardIcon'

export default memo(CopytoClipboardIcon)
