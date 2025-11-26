import { memo } from 'react'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { StyledCopytoClipboard, StyledIcon } from './styles'
import { CopyToClipboardProps } from './types'

export const CopytoClipboard = ({
  text,
  textToCopy,
  iconColor = 'purple3',
}: CopyToClipboardProps) => {
  const handleCopy = useCopyToClipboardAndNotify(textToCopy || '')

  return (
    <StyledCopytoClipboard onClick={handleCopy}>
      {text}
      <StyledIcon name="copy" $color={iconColor} size="0.8em" />
    </StyledCopytoClipboard>
  )
}
CopytoClipboard.displayName = 'CopytoClipboard'

export default memo(CopytoClipboard)
