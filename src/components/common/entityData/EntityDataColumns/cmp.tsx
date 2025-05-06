import React, { memo, useCallback } from 'react'
import { EntityDataColumnsProps } from './types'

export const EntityDataColumns = ({
  leftColumnElements,
  rightColumnElements,
}: EntityDataColumnsProps) => {
  const renderElements = useCallback(
    (elements: React.ReactNode[]) =>
      elements
        .filter(Boolean)
        .map((element, index) => <div key={index}>{element}</div>),
    [],
  )

  return (
    <div tw="w-full flex flex-wrap gap-x-24 gap-y-9 px-12 py-6">
      <div tw="flex-1 w-1/2 flex flex-col gap-y-9">
        {renderElements(leftColumnElements)}
      </div>
      <div tw="flex-1 w-1/2 flex flex-col gap-y-9">
        {renderElements(rightColumnElements)}
      </div>
    </div>
  )
}

EntityDataColumns.displayName = 'EntityDataColumns'

export default memo(EntityDataColumns) as typeof EntityDataColumns
