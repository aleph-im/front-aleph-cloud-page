import React, { memo, useMemo } from 'react'
import { Icon, ObjectImg } from '@aleph-front/core'
import ButtonLink from '../ButtonLink'
import { EntityCardItemProps, EntityCardProps, InformationProps } from './types'
import { InfoTooltipButton } from '../InfoTooltipButton/cmp'
import { StyledMainCard, StyledSubItemCard } from './styles'
import { useTheme } from 'styled-components'
import ComputingInformation from '../ComputingInformation'
import { ComputingInformationProps } from '../ComputingInformation/types'
import StorageInformation from '../StorageInformation'
import { StorageInformationProps } from '../StorageInformation/types'

const InformationElement = ({ type, data }: InformationProps) => {
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

const EntityCardItem = ({
  title,
  description,
  information,
}: EntityCardItemProps) => {
  return (
    <div>
      <p className="fs-18 text-base2 tp-h7" tw="-mr-1">
        {title}
      </p>
      <p className="fs-10" tw="-mr-1 mb-1">
        {description}
      </p>
      <InformationElement {...information} />
    </div>
  )
}
EntityCardItem.displayName = 'EntityCardItem'

export const EntityCard = ({
  title,
  titleTooltip,
  description,
  img,
  link,
  introductionButtonText,
  subItems = [],
  information,
  type = 'active',
  isComingSoon = false,
}: EntityCardProps) => {
  const theme = useTheme()

  const showSubItems = useMemo(() => {
    return subItems.length > 0
  }, [subItems])

  const imageColor = useMemo(() => {
    return isComingSoon ? theme.color.base2 : theme.color.main0
  }, [isComingSoon, theme])

  const headerElement = useMemo(() => {
    const titleElement = (
      <p className="tp-h7 text-base2" tw="text-center">
        {title}
      </p>
    )
    switch (type) {
      case 'active':
        return (
          <div tw="flex flex-col items-center justify-center relative">
            {isComingSoon && (
              <p className="tp-info" tw="absolute top-0 right-0 -mr-3 -mt-2">
                &#40;SOON&#41;
              </p>
            )}
            {titleTooltip ? (
              <InfoTooltipButton
                plain
                my="top-left"
                at="top-right"
                vAlign="bottom"
                iconSize="0.8em"
                tooltipContent={titleTooltip}
              >
                {titleElement}
              </InfoTooltipButton>
            ) : (
              titleElement
            )}
          </div>
        )
      case 'introduction':
        return (
          <div
            tw="flex items-center gap-2.5 mb-2.5"
            className="tp-header fs-16"
          >
            <ObjectImg shape color="main0" size={36} id={img as any} /> {title}
          </div>
        )
    }
  }, [img, isComingSoon, title, titleTooltip, type])

  const contentElement = useMemo(() => {
    const imageElement = (
      <div tw="flex justify-center">
        <ObjectImg color={imageColor} id={img as any} />
      </div>
    )
    switch (type) {
      case 'active':
        return imageElement
      case 'introduction':
        return (
          <div className="fs-12" tw="max-w-[13rem]">
            {description}
          </div>
        )
    }
  }, [description, imageColor, img, type])

  const footerElement = useMemo(() => {
    const buttonWithInformation = (
      <div tw="flex justify-between items-center">
        <ButtonLink
          kind="functional"
          variant="primary"
          forwardedAs="a"
          href={link}
          size="md"
          tw="h-[2.5em]! w-[2.5em]! rounded-full!"
        >
          <Icon name="circle-plus" size="1em" />
        </ButtonLink>
        <InformationElement {...information} />
      </div>
    )

    switch (type) {
      case 'active':
        return buttonWithInformation
      case 'introduction':
        return (
          <div tw="mt-auto">
            <ButtonLink variant="textOnly" size="sm" href={link}>
              <Icon name="plus-circle" /> {introductionButtonText}
            </ButtonLink>
          </div>
        )
    }
  }, [information, introductionButtonText, link, type])

  return (
    <div tw="flex">
      <StyledMainCard
        type={type}
        showSubItems={showSubItems}
        isComingSoon={isComingSoon}
      >
        {headerElement}
        {contentElement}
        {footerElement}
      </StyledMainCard>
      {showSubItems && (
        <StyledSubItemCard>
          {subItems.map((props) => (
            <EntityCardItemMemo
              key={`storage-subitem-${props.title}`}
              {...props}
            />
          ))}
        </StyledSubItemCard>
      )}
    </div>
  )
}
EntityCard.displayName = 'EntityCard'

export const InformationElementMemo = memo(
  InformationElement,
) as typeof InformationElement
export const EntityCardItemMemo = memo(EntityCardItem) as typeof EntityCardItem
export default memo(EntityCard) as typeof EntityCard
