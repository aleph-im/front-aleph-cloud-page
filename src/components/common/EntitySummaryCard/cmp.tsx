import React, { memo } from 'react'
import { Icon, NoisyContainer, ObjectImg } from '@aleph-front/core'
import { EntitySummaryCardProps } from './types'
import StorageInformation from '../StorageInformation'
import ButtonLink from '../ButtonLink'
import { InformationProps } from '../EntityCard/types'
import ComputingInformation from '../ComputingInformation'
import { ComputingInformationProps } from '../ComputingInformation/types'
import { StorageInformationProps } from '../StorageInformation/types'

const InformationElement = ({
  type,
  data,
}: { size: string } & InformationProps) => {
  switch (type) {
    case 'computing':
      return <ComputingInformation {...(data as ComputingInformationProps)} />
    case 'storage':
      return <StorageInformation {...(data as StorageInformationProps)} />
    default:
      return null
  }
}
InformationElement.displayName = 'InformationElement'

export const EntitySummaryCard = ({ items }: EntitySummaryCardProps) => {
  return (
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
