import React, { memo, useRef, useState, useEffect } from 'react'
import { Button, Icon, NoisyContainer, ObjectImg } from '@aleph-front/core'
import { EntitySummaryCardProps } from './types'
import StorageInformation from '../StorageInformation'
import ButtonLink from '../ButtonLink'
import { InformationProps } from '../EntityCard/types'
import ComputingInformation from '../ComputingInformation'
import { ComputingInformationProps } from '../ComputingInformation/types'
import { StorageInformationProps } from '../StorageInformation/types'
import ResponsiveTooltip from '../ResponsiveTooltip'
import ExternalLink from '../ExternalLink'

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

const SummaryButton = ({
  buttonUrl,
  buttonIsExternal,
  buttonDisabled,
  buttonTooltip,
}: {
  buttonUrl: string
  buttonIsExternal?: boolean
  buttonDisabled?: boolean
  buttonTooltip?: string
}) => {
  const [renderTooltip, setRenderTooltip] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRenderTooltip(true)
  }, [])

  if (buttonDisabled) {
    return (
      <div ref={wrapperRef} tw="relative">
        <Button
          kind="functional"
          variant="primary"
          size="md"
          disabled
          tw="h-[2.5em]! w-[2.5em]! rounded-full! opacity-50 cursor-not-allowed"
        >
          <Icon name="circle-plus" size="1em" />
        </Button>
        {renderTooltip && buttonTooltip && (
          <ResponsiveTooltip
            targetRef={wrapperRef}
            content={
              <div tw="flex flex-col gap-2">
                <span>{buttonTooltip}</span>
                <ExternalLink
                  href={buttonUrl}
                  text="Go to Credits console"
                  color="main0"
                />
              </div>
            }
            my="center-left"
            at="center-right"
          />
        )}
      </div>
    )
  }

  if (buttonIsExternal) {
    return (
      <Button
        as="a"
        href={buttonUrl}
        target="_blank"
        rel="noopener noreferrer"
        kind="functional"
        variant="primary"
        size="md"
        tw="h-[2.5em]! w-[2.5em]! rounded-full!"
      >
        <Icon name="circle-plus" size="1em" />
      </Button>
    )
  }

  return (
    <ButtonLink
      kind="functional"
      variant="primary"
      href={buttonUrl}
      size="md"
      tw="h-[2.5em]! w-[2.5em]! rounded-full!"
    >
      <Icon name="circle-plus" size="1em" />
    </ButtonLink>
  )
}
SummaryButton.displayName = 'SummaryButton'

export const EntitySummaryCard = ({ items }: EntitySummaryCardProps) => {
  return (
    <NoisyContainer tw="min-w-[22rem] h-36 p-6 w-fit flex items-center gap-3">
      {items.map(
        ({
          title,
          img,
          buttonUrl,
          buttonIsExternal,
          buttonDisabled,
          buttonTooltip,
          information,
        }) => (
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
                <SummaryButton
                  buttonUrl={buttonUrl}
                  buttonIsExternal={buttonIsExternal}
                  buttonDisabled={buttonDisabled}
                  buttonTooltip={buttonTooltip}
                />
              )}
            </div>
          </>
        ),
      )}
    </NoisyContainer>
  )
}
EntitySummaryCard.displayName = 'EntitySummaryCard'

export const InformationElementMemo = memo(
  InformationElement,
) as typeof InformationElement
export default memo(EntitySummaryCard) as typeof EntitySummaryCard
