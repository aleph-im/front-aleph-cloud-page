import React, { memo, useMemo } from 'react'
import { PermissionsRowActionsProps } from './types'
import { Icon } from '@aleph-front/core'
import DetailsMenuButton, {
  MenuItem,
} from '@/components/common/DetailsMenuButton'

export const PermissionsRowActions = ({
  isRevoked = false,
  onConfigure,
  onRevoke,
  onRestore,
}: PermissionsRowActionsProps) => {
  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
      {
        label: 'Configure',
        onClick: onConfigure,
        disabled: isRevoked,
      },
    ]

    if (isRevoked) {
      items.push({
        label: 'Restore',
        onClick: onRestore,
      })
    } else {
      items.push({
        label: 'Revoke',
        onClick: onRevoke,
      })
    }

    return items
  }, [isRevoked, onConfigure, onRevoke, onRestore])

  return (
    <DetailsMenuButton
      menuItems={menuItems}
      icon={isRevoked ? <Icon name="plus-circle" /> : <Icon name="ellipsis" />}
    />
  )
}

PermissionsRowActions.displayName = 'PermissionsRowActions'

export default memo(PermissionsRowActions) as typeof PermissionsRowActions
