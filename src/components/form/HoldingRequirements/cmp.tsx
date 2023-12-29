import {
  ellipseAddress,
  humanReadableCurrency,
  convertByteUnits,
  humanReadableSize,
  ellipseText,
  humanReadableDurationUnit,
} from '@/helpers/utils'
import { GreyLabel, StyledArrowIcon, StyledHoldingSummaryLine } from './styles'
import {
  HoldingRequirementsDomainLineProps,
  HoldingRequirementsProps,
  HoldingRequirementsSpecsLineProps,
  HoldingRequirementsVolumeLineProps,
} from './types'
import { memo, useEffect, useMemo, useState } from 'react'
import React from 'react'
import { EntityType, EntityTypeName, PaymentMethod } from '@/helpers/constants'
import { VolumeManager, VolumeType } from '@/domain/volume'
import InfoTooltipButton from '../../common/InfoTooltipButton'
import Container from '@/components/common/CenteredContainer'
import {
  NoisyContainer,
  TextGradient,
  TextInput,
} from '@aleph-front/aleph-core'
import { useEntityCost } from '@/hooks/common/useEntityCost'
import SelectPaymentMethod from '@/components/form/SelectPaymentMethod'
import { SelectStreamDuration } from '../SelectInstanceDuration'

const HoldingRequirementsSpecsLine = ({
  type,
  specs,
  cost,
}: HoldingRequirementsSpecsLineProps) => {
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
}
HoldingRequirementsSpecsLine.displayName = 'HoldingRequirementsSpecsLine'

// ------------------------------------------

const HoldingRequirementsVolumeLine = ({
  volume,
  cost,
  specs,
}: HoldingRequirementsVolumeLineProps) => {
  const [size, setSize] = useState<number>(0)

  useEffect(() => {
    async function load() {
      const size = await VolumeManager.getVolumeSize(volume)
      setSize(size)
    }

    load()
  }, [volume])

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
                          {humanReadableCurrency(cost.price - cost.cost)} ALEPH
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
}
HoldingRequirementsVolumeLine.displayName = 'HoldingRequirementsVolumeLine'

// ------------------------------------------

const HoldingRequirementsDomainLine = ({
  domain,
}: HoldingRequirementsDomainLineProps) => {
  return (
    <StyledHoldingSummaryLine>
      <div>CUSTOM DOMAIN</div>
      <div>{domain.name}</div>
      <div>-</div>
    </StyledHoldingSummaryLine>
  )
}
HoldingRequirementsDomainLine.displayName = 'HoldingRequirementsDomainLine'

// ------------------------------------------

export const HoldingRequirements = ({
  address,
  unlockedAmount,
  type,
  specs,
  volumes,
  domains,
  description,
  button: ButtonCmp,
  control,
  receiverAddress,
  streamDuration,
  paymentMethod,
  isPersistent = type === EntityType.Instance,
}: HoldingRequirementsProps) => {
  volumes = useMemo(
    () => volumes?.filter((volume) => !volume.isFake),
    [volumes],
  )

  const { cost } = useEntityCost({
    entityType: type,
    props: {
      specs,
      volumes,
      isPersistent,
      paymentMethod,
      streamDuration,
    },
  })

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

          {control && (
            <>
              <div tw="w-full py-4 my-6">
                <SelectPaymentMethod
                  name="paymentMethod"
                  control={control}
                  disabledHold
                />
              </div>
              {paymentMethod === PaymentMethod.Stream && (
                <NoisyContainer>
                  <TextGradient forwardedAs="h3" type="h7" tw="mb-6">
                    Instance Duration
                  </TextGradient>
                  <SelectStreamDuration
                    name="streamDuration"
                    control={control}
                  />
                </NoisyContainer>
              )}
            </>
          )}

          <div tw="my-6 p-6">
            <TextGradient forwardedAs="h3" type="h7" tw="mb-6">
              Summary
            </TextGradient>

            <div tw="max-w-full overflow-auto">
              <StyledHoldingSummaryLine isHeader>
                <div>UNLOCKED</div>
                <div className="tp-body1">
                  current wallet {ellipseAddress(address)}
                </div>
                <div>{humanReadableCurrency(unlockedAmount)} ALEPH</div>
              </StyledHoldingSummaryLine>

              {specs && (
                <HoldingRequirementsSpecsLineMemo
                  {...{
                    type,
                    specs,
                    cost: (cost as any)?.computeTotalCost,
                  }}
                />
              )}

              {volumes &&
                volumes.map((volume, index) => {
                  return (
                    <HoldingRequirementsVolumeLineMemo
                      key={volume.volumeType + index}
                      {...{
                        volume,
                        specs,
                        cost: cost?.perVolumeCost[index],
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
                    <HoldingRequirementsDomainLineMemo
                      key={domain.name}
                      domain={domain}
                    />
                  )
                })}

              <StyledHoldingSummaryLine>
                <div></div>
                <div className="tp-body2">
                  {paymentMethod === PaymentMethod.Hold
                    ? 'Total Staked'
                    : 'Streamed (per hour)'}
                </div>
                <div>
                  <span className="text-main1">
                    {humanReadableCurrency(cost?.totalCost)} ALEPH
                  </span>
                </div>
              </StyledHoldingSummaryLine>

              {paymentMethod === PaymentMethod.Stream &&
                cost?.totalStreamCost && (
                  <StyledHoldingSummaryLine>
                    <div></div>
                    <div className="tp-body2">
                      Total Streamed (
                      {humanReadableDurationUnit(streamDuration)})
                    </div>
                    <div>
                      <span className="text-main1">
                        {humanReadableCurrency(cost?.totalStreamCost)} ALEPH
                      </span>
                    </div>
                  </StyledHoldingSummaryLine>
                )}
            </div>
          </div>

          {paymentMethod === PaymentMethod.Stream && receiverAddress && (
            <NoisyContainer>
              <TextGradient forwardedAs="h3" type="h7" tw="mb-6">
                Review the transaction stream
              </TextGradient>
              <div tw="w-full flex items-end gap-6">
                <div tw="flex-1">
                  <TextInput
                    tabIndex={-1}
                    tw="pointer-events-none"
                    name="sender"
                    label="Sender"
                    value={ellipseText(address, 12, 10)}
                  />
                </div>
                <div>
                  <StyledArrowIcon />
                </div>
                <div tw="flex-1">
                  <TextInput
                    tabIndex={-1}
                    tw="pointer-events-none"
                    name="receiver"
                    label="Receiver"
                    value={ellipseText(receiverAddress, 12, 10)}
                  />
                </div>
              </div>
              <div className="fs-12" tw="text-center mt-6">
                Balance: {humanReadableCurrency(cost?.totalCost)} ALEPH per hour
              </div>
            </NoisyContainer>
          )}

          {ButtonCmp && <div tw="mt-16 text-center">{ButtonCmp}</div>}
        </Container>
      </section>
    </>
  )
}

const HoldingRequirementsSpecsLineMemo = memo(
  HoldingRequirementsSpecsLine,
) as typeof HoldingRequirementsSpecsLine

const HoldingRequirementsVolumeLineMemo = memo(
  HoldingRequirementsVolumeLine,
) as typeof HoldingRequirementsVolumeLine

const HoldingRequirementsDomainLineMemo = memo(
  HoldingRequirementsDomainLine,
) as typeof HoldingRequirementsDomainLine

export default memo(HoldingRequirements) as typeof HoldingRequirements
