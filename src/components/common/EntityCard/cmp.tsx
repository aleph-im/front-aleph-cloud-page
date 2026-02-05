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
import { AmountInformationProps } from '../AmountInformation/types'
import AmountInformation from '../AmountInformation'

const InformationElement = ({ type, data }: InformationProps) => {
  switch (type) {
    case 'computing':
      return <ComputingInformation {...(data as ComputingInformationProps)} />
    case 'storage':
      return <StorageInformation {...(data as StorageInformationProps)} />
    case 'amount':
      return <AmountInformation {...(data as AmountInformationProps)} />
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
      <InformationElementMemo {...information} />
    </div>
  )
}
EntityCardItem.displayName = 'EntityCardItem'

export const EntityCard = ({
  title,
  description,
  img,
  dashboardPath = '#',
  createPath = '#',
  createTarget = '_self',
  createDisabled = false,
  createDisabledMessage,
  introductionButtonText,
  subItems = [],
  information,
  type = 'active',
  isComingSoon = false,
  isBeta = false,
}: EntityCardProps) => {
  const theme = useTheme()

  const showSubItems = useMemo(() => {
    return subItems.length > 0
  }, [subItems])

  const imageColor = useMemo(() => {
    return isComingSoon ? theme.color.base2 : theme.color.main0
  }, [isComingSoon, theme])

  const headerElement = useMemo(() => {
    const topRightLabel =
      isBeta || isComingSoon ? (
        <p className="tp-info" tw="absolute top-0 right-0 -mr-3 -mt-2">
          &#40;{isBeta ? 'BETA' : 'SOON'}&#41;
        </p>
      ) : null

    switch (type) {
      case 'active':
        return (
          <div tw="flex flex-col items-center justify-center relative">
            {topRightLabel}
            <InfoTooltipButton
              plain
              my="top-left"
              at="top-right"
              vAlign="bottom"
              iconSize="0.8em"
              tooltipContent={description}
            >
              <p className="tp-h7 text-base2" tw="text-center">
                {title}
              </p>
            </InfoTooltipButton>
          </div>
        )
      case 'introduction':
        return (
          <div
            tw="flex items-center gap-2.5 mb-2.5 relative"
            className="tp-header fs-16"
          >
            {topRightLabel}
            <ObjectImg
              shape={isComingSoon ? false : true}
              color={imageColor}
              size={36}
              id={img as any}
            />{' '}
            {title}
          </div>
        )
    }
  }, [description, imageColor, img, isBeta, isComingSoon, title, type])

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
          <div className="fs-14" tw="max-w-[13rem]">
            {description}
          </div>
        )
    }
  }, [description, imageColor, img, type])

  const footerElement = useMemo(() => {
    switch (type) {
      case 'active':
        return (
          <div tw="flex justify-between items-center">
            <ButtonLink
              kind="functional"
              variant="primary"
              forwardedAs="a"
              href={dashboardPath}
              size="md"
              tw="h-[2.5em]! w-[2.5em]! rounded-full!"
            >
              <Icon name="angle-right" size="1em" />
            </ButtonLink>
            <InformationElement {...information} />
          </div>
        )
      case 'introduction':
        return (
          <div tw="mt-auto">
            <ButtonLink
              variant="textOnly"
              size="sm"
              href={createPath}
              target={createTarget}
              disabled={createDisabled}
              disabledMessage={createDisabledMessage}
            >
              <Icon name="plus-circle" /> {introductionButtonText}
            </ButtonLink>
          </div>
        )
    }
  }, [
    createPath,
    createTarget,
    createDisabled,
    createDisabledMessage,
    dashboardPath,
    information,
    introductionButtonText,
    type,
  ])

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
            <EntityCardItemMemo key={`${props.title}-subitem`} {...props} />
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
