import React, { memo } from 'react'
import { PermissionTypeItemProps } from './types'
import CountBadge from '@/components/common/CountBadge'

export const PermissionTypeItem = ({
  type,
  count,
}: PermissionTypeItemProps) => {
  return (
    <div className="tp-info fs-12" tw="flex items-center gap-x-1">
      {type}
      {count !== undefined && count > 0 && <CountBadge count={count} />}
    </div>
  )
}

PermissionTypeItem.displayName = 'PermissionTypeItem'

export default memo(PermissionTypeItem) as typeof PermissionTypeItem
