import React, { memo } from 'react'
import { StorageInformationProps } from './types'
import { StyledInformationContainer } from './styles'

export const StorageInformation = ({
  storage,
  amount,
}: StorageInformationProps) => {
  return (
    <div tw="flex justify-end gap-x-2.5">
      <StyledInformationContainer tw="px-3 py-2">
        <p className="fs-10 tp-body1">{storage.toFixed(2)} GB</p>
      </StyledInformationContainer>
      {amount !== undefined && (
        <StyledInformationContainer tw="px-3">
          <p className="fs-18 text-base2 tp-body2">{amount}</p>
        </StyledInformationContainer>
      )}
    </div>
  )
}
StorageInformation.displayName = 'StorageInformation'

export default memo(StorageInformation) as typeof StorageInformation
