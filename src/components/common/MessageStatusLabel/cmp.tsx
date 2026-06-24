import { memo } from 'react'
import { Label } from '@aleph-front/core'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import {
  EntityMessageStatus,
  getMessageStatusDisplay,
} from '@/helpers/messageStatus'

export type MessageStatusLabelProps = {
  status?: EntityMessageStatus
  /**
   * For executables: pass `false` while the resource is still being created on
   * its host CRN, so a `processed` message shows "CREATING" instead of "READY".
   */
  ready?: boolean
  /** Entity not loaded yet — shows the neutral loading state. */
  loading?: boolean
  className?: string
}

/**
 * Renders the aleph message lifecycle (Requesting/Ready/Creating/Rejected/…) as
 * a colored label with a spinner. Single rendering of the status mapping so
 * every resource view shows the same states.
 */
export const MessageStatusLabel = ({
  status,
  ready,
  loading,
  className,
}: MessageStatusLabelProps) => {
  const theme = useTheme()
  const { label, variant, spinner } = getMessageStatusDisplay(
    loading ? undefined : status,
    { ready },
  )

  return (
    <Label kind="secondary" variant={variant} className={className}>
      <div tw="flex items-center justify-center gap-2">
        <div>{label}</div>
        {spinner && (
          <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
        )}
      </div>
    </Label>
  )
}
MessageStatusLabel.displayName = 'MessageStatusLabel'

export default memo(MessageStatusLabel)
