import React, { memo } from 'react'
import { Icon, NoisyContainer, ObjectImg } from '@aleph-front/core'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/console/dashboard/common'
import RelatedEntityCard from '../RelatedEntityCard'
import { EntitySSHKeysProps } from './types'

export const EntitySSHKeys = ({
  sshKeys,
  onSSHKeyClick: handleSSHKeyClick,
}: EntitySSHKeysProps) => {
  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        SSH KEYS
      </div>
      <NoisyContainer>
        <div tw="flex flex-wrap gap-4">
          {sshKeys.length ? (
            sshKeys.map(
              (sshKey) =>
                sshKey && (
                  <RelatedEntityCard
                    key={sshKey?.id}
                    onClick={() => {
                      handleSSHKeyClick(sshKey)
                    }}
                  >
                    {/* @todo: Change object to key image */}
                    <ObjectImg
                      id="Object9"
                      color="base2"
                      size="2.5rem"
                      tw="min-w-[3rem] min-h-[3rem]"
                    />
                    <div>
                      <div className="tp-info text-main0 fs-12">
                        SSH KEY NAME
                      </div>
                      <Text>{sshKey.label}</Text>
                    </div>
                    <Icon
                      name="eye"
                      tw="absolute top-2 right-2"
                      className="openEntityIcon"
                    />
                  </RelatedEntityCard>
                ),
            )
          ) : (
            <div tw="flex items-center gap-6">
              <ObjectImg
                id="Object9"
                color="main0"
                size="2.5rem"
                tw="min-w-[3rem] min-h-[3rem]"
              />
              <div>
                <div className="tp-info text-main0 fs-12">SSH KEY NAME</div>
                <Text>
                  <Skeleton width="9rem" />
                </Text>
              </div>
              <div>
                <div className="tp-info text-main0 fs-12">CREATED ON</div>
                <Text>
                  <Skeleton width="14rem" />
                </Text>
              </div>
            </div>
          )}
        </div>
      </NoisyContainer>
    </>
  )
}
EntitySSHKeys.displayName = 'EntitySSHKeys'

export default memo(EntitySSHKeys) as typeof EntitySSHKeys
