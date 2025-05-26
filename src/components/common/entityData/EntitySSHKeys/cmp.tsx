import React, { memo } from 'react'
import { Icon, NoisyContainer, ObjectImg } from '@aleph-front/core'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/console/common'
import RelatedEntityCard from '../RelatedEntityCard'
import { EntitySSHKeysProps } from './types'
import { EntityType, EntityTypeObject } from '@/helpers/constants'
import InfoTitle from '../InfoTitle'

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
                    <ObjectImg
                      id={EntityTypeObject[EntityType.SSHKey]}
                      color="base2"
                      size="2.5rem"
                      tw="min-w-[3rem] min-h-[3rem]"
                    />
                    <div>
                      <InfoTitle>SSH KEY NAME</InfoTitle>
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
                id={EntityTypeObject[EntityType.SSHKey]}
                color="main0"
                size="2.5rem"
                tw="min-w-[3rem] min-h-[3rem]"
              />
              <div>
                <InfoTitle>SSH KEY NAME</InfoTitle>
                <Text>
                  <Skeleton width="9rem" />
                </Text>
              </div>
              <div>
                <InfoTitle>CREATED ON</InfoTitle>
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
