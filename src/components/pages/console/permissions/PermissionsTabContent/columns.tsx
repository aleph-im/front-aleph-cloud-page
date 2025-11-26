import React from 'react'
import tw from 'twin.macro'
import { AccountPermissions } from '@/domain/permissions'
import { ellipseText } from '@/helpers/utils'
import CopyToClipboard from '@/components/common/CopyToClipboard'
import CountBadge from '@/components/common/CountBadge'
import PermissionsList from '../PermissionsList'
import PermissionsRowActions from '../PermissionsRowActions'
import { PermissionsTableColumnsProps } from './types'

export const getPermissionsTableColumns = ({
  onRowConfigure,
  onRowRevoke,
}: PermissionsTableColumnsProps) => [
  {
    label: 'Address',
    sortable: true,
    render: ({ id }: AccountPermissions) => (
      <span onClick={(e) => e.stopPropagation()}>
        <CopyToClipboard
          text={<span className="tp-body1 fs-14">{ellipseText(id, 7, 8)}</span>}
          textToCopy={id}
        />
      </span>
    ),
  },
  {
    label: 'Alias',
    sortable: true,
    render: ({ alias }: AccountPermissions) => (
      <div className="tp-info fs-12">{alias || '-'}</div>
    ),
  },
  {
    label: 'Channels',
    render: ({ channels }: AccountPermissions) => {
      if (!channels.length) {
        return <div className="tp-info fs-12">All</div>
      }

      return <CountBadge count={channels.length} />
    },
  },
  {
    label: 'Permissions',
    render: ({ messageTypes }: AccountPermissions) => {
      return <PermissionsList messageTypes={messageTypes} />
    },
  },
  {
    label: '',
    width: '100%',
    align: 'right' as const,
    render: (row: AccountPermissions) => (
      <PermissionsRowActions
        onConfigure={() => onRowConfigure(row)}
        onRevoke={() => onRowRevoke(row)}
      />
    ),
    cellProps: () => ({
      css: tw`pl-3!`,
    }),
  },
]
