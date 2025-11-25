import { memo } from 'react'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { StyledCopytoClipboard, StyledIcon } from './styles'
import { CopyToClipboardProps } from './types'

export const CopytoClipboardIcon = ({
  text,
  textToCopy,
  iconColor = 'purple3',
}: CopyToClipboardProps) => {
  const handleCopy = useCopyToClipboardAndNotify(textToCopy || '')

  return (
    <StyledCopytoClipboard onClick={handleCopy}>
      {text}
      <StyledIcon name="copy" $color={iconColor} />
    </StyledCopytoClipboard>
  )
}
CopytoClipboardIcon.displayName = 'CopytoClipboardIcon'

export default memo(CopytoClipboardIcon)
