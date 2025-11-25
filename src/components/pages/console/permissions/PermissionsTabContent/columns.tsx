import React from 'react'
import tw from 'twin.macro'
import { Permission } from '@/domain/permissions'
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
    render: ({ address }: Permission) => (
      <span onClick={(e) => e.stopPropagation()}>
        <CopyToClipboard
          text={
            <span className="tp-body1 fs-14">{ellipseText(address, 7, 8)}</span>
          }
          textToCopy={address}
        />
      </span>
    ),
  },
  {
    label: 'Alias',
    sortable: true,
    render: ({ alias }: Permission) => (
      <div className="tp-info fs-12">{alias || '-'}</div>
    ),
  },
  {
    label: 'Channels',
    render: ({ channels }: Permission) => {
      if (!channels?.length) {
        return <div className="tp-info fs-12">All</div>
      }

      return <CountBadge count={channels.length} />
    },
  },
  {
    label: 'Permissions',
    render: ({ types, post_types, aggregate_keys }: Permission) => {
      const postTypesCount = post_types?.length || 10
      const aggregateKeysCount = aggregate_keys?.length || 5

      return (
        <PermissionsList
          types={types}
          postTypesCount={postTypesCount}
          aggregateKeysCount={aggregateKeysCount}
        />
      )
    },
  },
  {
    label: '',
    width: '100%',
    align: 'right' as const,
    render: (row: Permission) => (
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
