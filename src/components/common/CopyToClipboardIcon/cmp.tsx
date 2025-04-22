import { memo } from 'react'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { StyledCopytoClipboardIcon } from './styles'
import { CopyToClipboardIconProps } from './types'

export const CopytoClipboardIcon = ({ text }: CopyToClipboardIconProps) => {
  const handleCopy = useCopyToClipboardAndNotify(text || '')

  return <StyledCopytoClipboardIcon name="copy" onClick={handleCopy} />
}
CopytoClipboardIcon.displayName = 'CopytoClipboardIcon'

export default memo(CopytoClipboardIcon)
