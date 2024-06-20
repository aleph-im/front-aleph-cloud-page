import React, { memo } from 'react'
import { Icon, NoisyContainer, ObjectImg } from '@aleph-front/core'
import { EntitySummaryCardProps } from './types'
import { StyledEntitySummaryCard } from './styles'
import { ComputingEntityDataPill } from '../ComputingEntityDataPill/cmp'
import StorageInformation from '../StorageInformation'
import ButtonLink from '../ButtonLink'
import { InformationProps } from '../EntityCard/types'
import ComputingInformation from '../ComputingInformation'
import { ComputingInformationProps } from '../ComputingInformation/types'
import { StorageInformationProps } from '../StorageInformation/types'

const InformationElement = ({
  size,
  type,
  data,
}: { size: string } & InformationProps) => {
  switch (type) {
    case 'computing':
      const computingData = data as ComputingInformationProps

      return size === 'sm' ? (
        <ComputingEntityDataPill value={computingData.running} icon="play" />
      ) : (
        <ComputingInformation {...computingData} />
      )
    case 'storage':
      const storageData = data as StorageInformationProps

      return <StorageInformation {...storageData} />
    default:
      return null
  }
}
InformationElement.displayName = 'InformationElement'

export const EntitySummaryCard = ({
  size = 'sm',
  items,
}: EntitySummaryCardProps) => {
  return size === 'sm' ? (
    <StyledEntitySummaryCard>
      {items.map(({ title, img, information }) => (
        <div key="title" tw="flex justify-between w-full">
          <div tw="flex items-center gap-3">
            <ObjectImg shape color="main0" size={36} id={img as any} />
            <p className="tp-h7 text-base2 fs-16">{title}</p>
          </div>
          <InformationElement size={size} {...information} />
        </div>
      ))}
    </StyledEntitySummaryCard>
  ) : (
    <NoisyContainer tw="min-w-[22rem] h-36 p-6 w-fit flex items-center gap-3">
      {items.map(({ title, img, buttonUrl, information }) => (
        <>
          {title && (
            <div tw="flex flex-col justify-center items-center text-center">
              <p className="tp-info text-base2">{title}</p>
              <ObjectImg color="main0" id={img as any} size="4.7em" />
            </div>
          )}
          <div tw="flex justify-between w-full">
            <div tw="flex flex-col gap-3">
              <p className="tp-info text-base2">{information.title}</p>
              <InformationElement size="size" {...information} />
            </div>
            {buttonUrl && (
              <ButtonLink
                kind="functional"
                variant="primary"
                forwardedAs="a"
                href={buttonUrl}
                size="md"
                tw="h-[2.5em]! w-[2.5em]! rounded-full!"
              >
                <Icon name="circle-plus" size="1em" />
              </ButtonLink>
            )}
          </div>
        </>
      ))}
    </NoisyContainer>
  )
}
EntitySummaryCard.displayName = 'EntitySummaryCard'

export const InformationElementMemo = memo(
  InformationElement,
) as typeof InformationElement
export default memo(EntitySummaryCard) as typeof EntitySummaryCard
