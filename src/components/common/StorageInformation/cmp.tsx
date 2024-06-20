import React, { memo } from 'react'
import { StorageInformationProps } from './types'
import { StyledInformationContainer } from './styles'
import { humanReadableSize } from '@aleph-front/core'

export const StorageInformation = ({
  storage = 0,
  amount = 0,
}: StorageInformationProps = {}) => {
  return (
    <div tw="flex justify-end gap-x-2.5">
      <StyledInformationContainer tw="px-3 py-2">
        <p className="fs-10 tp-body1">{humanReadableSize(storage, 'MiB')}</p>
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
