import React, { memo } from 'react'
import { StorageInformationProps } from './types'
import { StyledStorageInformationContainer } from './styles'
import { humanReadableSize } from '@aleph-front/core'
import AmountInformation from '../AmountInformation'

export const StorageInformation = ({
  size = 0,
  amount = 0,
}: StorageInformationProps = {}) => {
  return (
    <div tw="flex justify-end gap-x-2.5">
      {size !== 0 && (
        <StyledStorageInformationContainer tw="px-3 py-2">
          <p className="fs-10 tp-body1">{humanReadableSize(size, 'MiB')}</p>
        </StyledStorageInformationContainer>
      )}
      <AmountInformation amount={amount} />
    </div>
  )
}
StorageInformation.displayName = 'StorageInformation'

export default memo(StorageInformation) as typeof StorageInformation
