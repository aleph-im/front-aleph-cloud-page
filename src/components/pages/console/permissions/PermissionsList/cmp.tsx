import React, { memo } from 'react'
import { PermissionsListProps } from './types'
import PermissionTypeItem from '../PermissionTypeItem'

export const PermissionsList = ({
  types,
  postTypesCount,
  aggregateKeysCount,
}: PermissionsListProps) => {
  if (!types?.length) {
    return <div className="tp-info fs-12">All</div>
  }

  return (
    <div tw="flex items-center gap-x-0.5">
      {types.map((type, index) => {
        const isLast = index === types.length - 1
        const typeLower = type.toLowerCase()

        let count: number | undefined

        if (typeLower === 'post' && postTypesCount > 0) {
          count = postTypesCount
        } else if (typeLower === 'aggregate' && aggregateKeysCount > 0) {
          count = aggregateKeysCount
        }

        return (
          <React.Fragment key={type}>
            <PermissionTypeItem type={type} count={count} />
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
