import React, { memo } from 'react'
import { NoisyContainer, ObjectImg } from '@aleph-front/core'
import { EntityPersistentStorageProps } from './types'
import { Text } from '@/components/pages/console/dashboard/common'
import { humanReadableSize } from '@/helpers/utils'

export const EntityPersistentStorage = ({
  persistentVolumes,
}: EntityPersistentStorageProps) => {
  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        PERSISTENT STORAGE
      </div>
      <NoisyContainer>
        <div tw="flex gap-4">
          <ObjectImg
            id="Object16"
            color="main0"
            size="3rem"
            tw="min-w-[4rem] min-h-[4rem]"
          />
          <div tw="flex flex-wrap gap-4">
            {persistentVolumes.map(
              (volume, i) =>
                volume && (
                  <div key={`persistent-volume-${i}`}>
                    <div tw="flex gap-2 p-3 opacity-60" className="bg-base1">
                      <div tw="flex flex-col gap-1">
                        <div className="tp-info fs-12">{volume.name}</div>
                        <div className="tp-info">{volume.mount}</div>
                        <div tw="flex justify-between items-center gap-4">
                          <Text className="fs-12">
                            {humanReadableSize(volume.size_mib, 'MiB')}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      </NoisyContainer>
    </>
  )
}
EntityPersistentStorage.displayName = 'EntityPersistentStorage'

export default memo(EntityPersistentStorage) as typeof EntityPersistentStorage
