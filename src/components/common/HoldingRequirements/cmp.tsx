import {
  ellipseAddress,
  humanReadableCurrency,
  convertByteUnits,
  humanReadableSize,
} from '@/helpers/utils'
import { GreyLabel, StyledHoldingSummaryLine } from './styles'
import {
  HoldingRequirementsDomainLineProps,
  HoldingRequirementsProps,
  HoldingRequirementsSpecsLineProps,
  HoldingRequirementsVolumeLineProps,
} from './types'
import { useMemo } from 'react'
import React from 'react'
import { EntityType, EntityTypeName } from '@/helpers/constants'
import { InstanceManager } from '@/domain/instance'
import { ProgramManager } from '@/domain/program'
import { VolumeManager, VolumeType } from '@/domain/volume'
import InfoTooltipButton from '../InfoTooltipButton'
import Container from '@/components/common/CenteredContainer'
import { TextGradient } from '@aleph-front/aleph-core'

const HoldingRequirementsSpecsLine = React.memo(
  ({ type, specs, cost }: HoldingRequirementsSpecsLineProps) => {
    const { cpu, ram, storage } = specs

    const cpuStr = useMemo(() => `${cpu}x86-64bit`, [cpu])

    const ramStr = useMemo(
      () =>
        `${convertByteUnits(ram, {
          from: 'MiB',
          to: 'GiB',
          displayUnit: false,
        })}GB-RAM`,
      [ram],
    )

    const storageStr = useMemo(
      () =>
        `${convertByteUnits(storage, {
          from: 'MiB',
          to: 'GiB',
          displayUnit: false,
        })}GB-HDD`,
      [storage],
    )

    const specsStr = useMemo(
      () =>
        `${cpuStr}.${ramStr}${
          type === EntityType.Instance ? `.${storageStr}` : ''
        }`,
      [cpuStr, ramStr, storageStr, type],
    )

    return (
      <StyledHoldingSummaryLine>
        <div>
          <div>{EntityTypeName[type].toUpperCase()}</div>
        </div>
        <div>
          <div>{specsStr}</div>
        </div>
        <div>
          <div>{humanReadableCurrency(cost)} ALEPH</div>
        </div>
      </StyledHoldingSummaryLine>
    )
  },
)
HoldingRequirementsSpecsLine.displayName = 'HoldingRequirementsSpecsLine'

const HoldingRequirementsVolumeLine = React.memo(
  ({ volume, cost, specs }: HoldingRequirementsVolumeLineProps) => {
    const size = VolumeManager.getVolumeSize(volume)
    if (!cost) return <></>

    const hasDiscount = !!cost.discount
    const fullDiscount = !cost.cost

    return (
      <StyledHoldingSummaryLine>
        <div>
          <div>
            STORAGE
            <GreyLabel tw="ml-2">
              {volume.volumeType === VolumeType.Persistent
                ? 'PERSISTENT'
                : 'VOLUME'}
            </GreyLabel>
          </div>
        </div>
        <div>
          <div>{humanReadableSize(size, 'MiB')}</div>
        </div>
        <div>
          <div>
            {hasDiscount ? (
              <InfoTooltipButton
                plain
                align="left"
                my="bottom-left"
                at="bottom-right"
                tooltipContent={
                  <div tw="text-left">
                    <div className="tp-body1 fs-18">
                      {fullDiscount ? (
                        <>
                          The cost displayed for the added storage is{' '}
                          <span className="text-main0">
                            {humanReadableCurrency(cost.cost)} ALEPH
                          </span>{' '}
                          as this resource is already included in your selected
                          package at no additional charge.
                        </>
                      ) : (
                        <>
                          Good news! The displayed price is lower than usual due
                          to a discount of{' '}
                          <span className="text-main0">
                            {humanReadableCurrency(cost.price - cost.cost)}{' '}
                            ALEPH
                          </span>
                          {specs && (
                            <>
                              {` for `}
                              <span className="text-main0">
                                {convertByteUnits(specs.storage, {
                                  from: 'MiB',
                                  to: 'GiB',
                                  displayUnit: true,
                                })}
                              </span>{' '}
                              included in your package.
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                }
              >
                {humanReadableCurrency(cost.cost)} ALEPH
              </InfoTooltipButton>
            ) : (
              <>{humanReadableCurrency(cost.cost)} ALEPH</>
            )}
          </div>
        </div>
      </StyledHoldingSummaryLine>
    )
  },
)
HoldingRequirementsVolumeLine.displayName = 'HoldingRequirementsVolumeLine'

const HoldingRequirementsDomainLine = React.memo(
  ({ domain }: HoldingRequirementsDomainLineProps) => {
    return (
      <StyledHoldingSummaryLine>
        <div>CUSTOM DOMAIN</div>
        <div>{domain.name}</div>
        <div>-</div>
      </StyledHoldingSummaryLine>
    )
  },
)
HoldingRequirementsDomainLine.displayName = 'HoldingRequirementsDomainLine'

export default function HoldingRequirements({
  address,
  unlockedAmount,
  type,
  specs,
  volumes,
  domains,
  isPersistent = type === EntityType.Instance,
  button: ButtonCmp,
  description,
}: HoldingRequirementsProps) {
  volumes = volumes?.filter((volume) => !volume.isFake)

  const { computeTotalCost, perVolumeCost, totalCost } = useMemo(() => {
    switch (type) {
      case EntityType.Program:
        return ProgramManager.getCost({
          specs,
          volumes,
          isPersistent,
        })
      case EntityType.Instance:
        return InstanceManager.getCost({
          specs,
          volumes,
        })
      case EntityType.Volume:
        return {
          ...VolumeManager.getCost({
            volumes,
          }),
          computeTotalCost: 0,
        }
    }
  }, [isPersistent, specs, type, volumes])

  return (
    <>
      <div tw="md:mt-32" />
      <section
        className="fx-noise-light"
        tw="px-0 pt-6 pb-24 md:pt-16 md:pb-32 md:mt-auto"
      >
        <Container>
          <TextGradient forwardedAs="h2" type="h5" tw="mb-1">
            Estimated holding requirements
          </TextGradient>
          {description && (
            <div tw="mt-1 mb-6">
              <p className="text-main2">{description}</p>
            </div>
          )}
          <div tw="my-7">
            <div tw="max-w-full overflow-auto">
              <StyledHoldingSummaryLine isHeader>
                <div>UNLOCKED</div>
                <div className="tp-body1">
                  current wallet {ellipseAddress(address)}
                </div>
                <div>{humanReadableCurrency(unlockedAmount)} ALEPH</div>
              </StyledHoldingSummaryLine>

              {specs && (
                <HoldingRequirementsSpecsLine
                  {...{
                    type,
                    specs,
                    isPersistent,
                    perVolumeCost,
                    cost: computeTotalCost,
                  }}
                />
              )}

              {volumes &&
                volumes.map((volume, index) => {
                  return (
                    <HoldingRequirementsVolumeLine
                      key={volume.volumeType + index}
                      {...{
                        volume,
                        specs,
                        cost: perVolumeCost[index],
                      }}
                    />
                  )
                })}

              {type === EntityType.Program && (
                <StyledHoldingSummaryLine>
                  <div>TYPE</div>
                  <div>{isPersistent ? 'persistent' : 'on-demand'}</div>
                  <div>-</div>
                </StyledHoldingSummaryLine>
              )}

              {domains &&
                domains.map((domain) => {
                  return (
                    <HoldingRequirementsDomainLine
                      key={domain.name}
                      domain={domain}
                    />
                  )
                })}

              <StyledHoldingSummaryLine>
                <div></div>
                <div className="tp-body2">Total Staked</div>
                <div>
                  <span className="text-main1">
                    {humanReadableCurrency(totalCost)} ALEPH
                  </span>
                </div>
              </StyledHoldingSummaryLine>
            </div>
          </div>
          {ButtonCmp && <div tw="mt-7 text-center">{ButtonCmp}</div>}
        </Container>
      </section>
    </>
  )
}
