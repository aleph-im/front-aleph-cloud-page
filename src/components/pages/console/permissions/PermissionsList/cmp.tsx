import React, { memo } from 'react'
import { PermissionsListProps } from './types'
import PermissionTypeItem from '../PermissionTypeItem'

export const PermissionsList = ({ messageTypes }: PermissionsListProps) => {
  // Filter only authorized message types
  const authorizedTypes = messageTypes.filter((mt) => mt.authorized)

  if (authorizedTypes.length === 0) {
    return <div className="tp-info fs-12">None</div>
  }

  return (
    <div tw="flex items-center gap-x-0.5">
      {authorizedTypes.map((messageType, index) => {
        const isLast = index === authorizedTypes.length - 1
        const typeName = messageType.type.toUpperCase()

        let count: number | undefined

        // For POST and AGGREGATE, show count if there are filters
        if (messageType.type === 'post' && 'postTypes' in messageType) {
          count = messageType.postTypes.length || undefined
        } else if (
          messageType.type === 'aggregate' &&
          'aggregateKeys' in messageType
        ) {
          count = messageType.aggregateKeys.length || undefined
        }

        return (
          <React.Fragment key={messageType.type}>
            <PermissionTypeItem type={typeName} count={count} />
            {!isLast && (
              <span className="tp-info fs-12" tw="mr-0.5">
                ,
              </span>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

PermissionsList.displayName = 'PermissionsList'

export default memo(PermissionsList) as typeof PermissionsList
