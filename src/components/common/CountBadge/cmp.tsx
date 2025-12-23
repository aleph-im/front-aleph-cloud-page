import React, { memo } from 'react'
import { CountBadgeProps } from './types'

export const CountBadge = ({ count }: CountBadgeProps) => {
  return (
    <div
      tw="flex items-center min-w-4 min-h-4 w-fit py-1 px-1.5 rounded-md"
      className="bg-purple4 fs-10 tp-info"
    >
      {count}
    </div>
  )
}

CountBadge.displayName = 'CountBadge'

export default memo(CountBadge) as typeof CountBadge
