import {
  ellipseAddress,
  convertByteUnits,
  humanReadableSize,
  ellipseText,
} from '@/helpers/utils'
import { Label, StyledArrowIcon, StyledHoldingSummaryLine } from './styles'
import {
  CheckoutSummaryDomainLineProps,
  CheckoutSummaryProps,
  CheckoutSummarySpecsLineProps,
  CheckoutSummaryVolumeLineProps,
  CheckoutSummaryWebsiteLineProps,
} from './types'
import { memo, useEffect, useMemo, useState } from 'react'
import React from 'react'
import { EntityType, EntityTypeName, PaymentMethod } from '@/helpers/constants'
import { VolumeCost, VolumeManager, VolumeType } from '@/domain/volume'
import InfoTooltipButton from '../../common/InfoTooltipButton'
import Container from '@/components/common/CenteredContainer'
import { TextGradient, TextInput } from '@aleph-front/core'
import { useEntityCost } from '@/hooks/common/useEntityCost'
import SelectPaymentMethod from '@/components/form/SelectPaymentMethod'
import Price from '@/components/common/Price'
import CheckoutSummaryFooter from '../CheckoutSummaryFooter'
import { AddWebsite, WebsiteCost, WebsiteManager } from '@/domain/website'

const CheckoutSummarySpecsLine = ({
  type,
  specs,
  cost,
  priceDuration,
}: CheckoutSummarySpecsLineProps) => {
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
        <div>
          <Price value={cost} duration={priceDuration} />
        </div>
      </div>
    </StyledHoldingSummaryLine>
  )
}
CheckoutSummarySpecsLine.displayName = 'CheckoutSummarySpecsLine'

// ------------------------------------------

const CheckoutSummaryVolumeLine = ({
  volume,
  cost,
  specs,
  priceDuration,
}: CheckoutSummaryVolumeLineProps) => {
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
          <Label tw="ml-2">
            {volume.volumeType === VolumeType.Persistent
              ? 'PERSISTENT'
              : 'VOLUME'}
          </Label>
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
                          <Price value={cost.cost} duration={priceDuration} />
                        </span>{' '}
                        as this resource is already included in your selected
                        package at no additional charge.
                      </>
                    ) : (
                      <>
                        Good news! The displayed price is lower than usual due
                        to a discount of{' '}
                        <span className="text-main0">
                          <Price
                            value={cost.price - cost.cost}
                            duration={priceDuration}
                          />
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
              <Price value={cost.cost} duration={priceDuration} />
            </InfoTooltipButton>
          ) : (
            <>
              <Price value={cost.cost} duration={priceDuration} />
            </>
          )}
        </div>
      </div>
    </StyledHoldingSummaryLine>
  )
}
CheckoutSummaryVolumeLine.displayName = 'CheckoutSummaryVolumeLine'

// ------------------------------------------

const CheckoutSummaryWebsiteLine = ({
  website,
  cost,
}: CheckoutSummaryWebsiteLineProps) => {
  const [size, setSize] = useState<number>(0)

  useEffect(() => {
    async function load() {
      const size = await WebsiteManager.getWebsiteSize({
        website,
      } as AddWebsite)
      setSize(size)
    }

    load()
  }, [website])

  if (!cost) return <></>

  return (
    <StyledHoldingSummaryLine>
      <div>
        <div>WEBSITE SIZE</div>
      </div>
      <div>
        <div>{humanReadableSize(size, 'MiB')}</div>
      </div>
      <div>
        <Price value={cost} />
      </div>
    </StyledHoldingSummaryLine>
  )
}
CheckoutSummaryWebsiteLine.displayName = 'CheckoutSummaryWebsiteLine'

// ------------------------------------------

const CheckoutSummaryDomainLine = ({
  domain,
}: CheckoutSummaryDomainLineProps) => {
  return (
    <StyledHoldingSummaryLine>
      <div>CUSTOM DOMAIN</div>
      <div>{domain.name}</div>
      <div>-</div>
    </StyledHoldingSummaryLine>
  )
}
CheckoutSummaryDomainLine.displayName = 'CheckoutSummaryDomainLine'

// ------------------------------------------

// @todo: Refactor: Split in different components
export const CheckoutSummary = ({
  address,
  unlockedAmount,
  type,
  specs,
  volumes,
  domains,
  description,
  button: buttonNode,
  control,
  receiverAddress,
  paymentMethod,
  isPersistent = type === EntityType.Instance,
  website,
  mainRef,
}: // streamDuration,
CheckoutSummaryProps) => {
  const { cost } = useEntityCost({
    entityType: type,
    props: {
      website,
      specs,
      volumes,
      isPersistent,
      paymentMethod,
      // streamDuration,
    },
  })

  const priceDuration = paymentMethod === PaymentMethod.Stream ? 'h' : undefined
  const disabledHold = paymentMethod !== PaymentMethod.Hold
  const disabledStream = paymentMethod !== PaymentMethod.Stream

  const paymentMethodSwitchNode = control && (
    <SelectPaymentMethod
      name="paymentMethod"
      control={control}
      disabledHold={disabledHold}
      disabledStream={disabledStream}
    />
  )

  return (
    <>
      <div tw="md:mt-32" />
      <CheckoutSummaryFooter
        {...{
          paymentMethod,
          submitButton: buttonNode,
          paymentMethodSwitch: paymentMethodSwitchNode,
          mainRef,
          totalCost: cost?.totalCost,
        }}
      />
      <section
        className="fx-noise-light fx-grain-4"
        tw="px-0 pt-6 pb-24 md:pt-16 md:pb-32 md:mt-auto"
      >
        <Container>
          <div className="bg-base1" tw="p-6">
            <TextGradient forwardedAs="h2" type="h5" tw="mb-1">
              Checkout summary
            </TextGradient>
            {description && (
              <div tw="mt-1 mb-6">
                <p className="text-main2">{description}</p>
              </div>
            )}

            {control && (
              <>
                <div tw="w-full my-6 mt-10">
                  <div className="bg-purple0" tw="p-6">
                    <TextGradient forwardedAs="h3" type="h7" tw="mb-3">
                      Payment Method
                    </TextGradient>
                    <div tw="my-4">{paymentMethodSwitchNode}</div>
                  </div>
                </div>
                {/* {paymentMethod === PaymentMethod.Stream && (
                  <div className="bg-purple0" tw="p-6">
                    <TextGradient forwardedAs="h3" type="h7" tw="mb-3">
                      Instance Duration
                    </TextGradient>
                    <SelectStreamDuration
                      name="streamDuration"
                      control={control}
                    />
                  </div>
                )} */}
              </>
            )}

            <div tw="my-6 p-6">
              <div tw="max-w-full overflow-auto">
                <StyledHoldingSummaryLine $isHeader className="tp-body3 fs-12">
                  <div>UNLOCKED</div>
                  <div>CURRENT WALLET {ellipseAddress(address)}</div>
                  <div>
                    <Price value={unlockedAmount} />
                  </div>
                </StyledHoldingSummaryLine>
                {(type === EntityType.Program ||
                  type === EntityType.Instance) &&
                  specs && (
                    <CheckoutSummarySpecsLineMemo
                      {...{
                        type,
                        specs,
                        cost: (cost as any)?.computeTotalCost,
                        priceDuration,
                      }}
                    />
                  )}
                {volumes &&
                  volumes.map((volume, index) => {
                    return (
                      <CheckoutSummaryVolumeLineMemo
                        key={volume.volumeType + index}
                        {...{
                          volume,
                          specs,
                          cost: (cost as VolumeCost)?.perVolumeCost?.[index],
                          priceDuration,
                        }}
                      />
                    )
                  })}
                {type === EntityType.Website && website && (
                  <CheckoutSummaryWebsiteLineMemo
                    {...{
                      website,
                      cost: (cost as WebsiteCost).totalCost,
                    }}
                  />
                )}
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
                      <CheckoutSummaryDomainLineMemo
                        key={domain.name}
                        domain={domain}
                      />
                    )
                  })}
                <StyledHoldingSummaryLine>
                  <div></div>
                  <div className="text-main0 tp-body2">
                    {paymentMethod === PaymentMethod.Hold
                      ? 'Total'
                      : 'Total / h'}
                  </div>
                  <div>
                    <span className="text-main0 tp-body3">
                      <Price value={cost?.totalCost} />
                    </span>
                  </div>
                </StyledHoldingSummaryLine>
                {paymentMethod === PaymentMethod.Stream &&
                  cost?.totalStreamCost && (
                    <StyledHoldingSummaryLine>
                      <div></div>
                      <div className="text-main0 tp-body2">Min. required</div>
                      <div>
                        <span className="text-main0 tp-body3">
                          {/* <Price value={cost?.totalStreamCost} /> */}
                          <Price value={cost?.totalCost * 4} />
                        </span>
                      </div>
                    </StyledHoldingSummaryLine>
                  )}
              </div>
            </div>

            {paymentMethod === PaymentMethod.Stream && receiverAddress && (
              <div className="bg-purple0" tw="p-6">
                <TextGradient forwardedAs="h3" type="h7" tw="mb-6">
                  Review the transaction
                </TextGradient>
                <div tw="w-full flex flex-col md:flex-row items-stretch md:items-end gap-0 md:gap-6">
                  <div tw="flex-1">
                    <TextInput
                      tabIndex={-1}
                      name="sender"
                      label="Sender"
                      value={ellipseText(address, 12, 10)}
                      dataView
                    />
                  </div>
                  <div tw="self-center md:self-end rotate-90 md:rotate-0 pl-9 md:pl-0">
                    <StyledArrowIcon />
                  </div>
                  <div tw="flex-1">
                    <TextInput
                      tabIndex={-1}
                      name="receiver"
                      label="Receiver"
                      value={ellipseText(receiverAddress, 12, 10)}
                      dataView
                    />
                  </div>
                </div>
                <div
                  className="text-main0 tp-body2 fs-12"
                  tw="text-center mt-6"
                >
                  Balance: <Price value={cost?.totalCost} /> per hour
                </div>
              </div>
            )}

            {buttonNode && <div tw="mt-16 text-center">{buttonNode}</div>}
          </div>
        </Container>
      </section>
    </>
  )
}

const CheckoutSummarySpecsLineMemo = memo(
  CheckoutSummarySpecsLine,
) as typeof CheckoutSummarySpecsLine

const CheckoutSummaryVolumeLineMemo = memo(
  CheckoutSummaryVolumeLine,
) as typeof CheckoutSummaryVolumeLine

const CheckoutSummaryWebsiteLineMemo = memo(
  CheckoutSummaryWebsiteLine,
) as typeof CheckoutSummaryWebsiteLine

const CheckoutSummaryDomainLineMemo = memo(
  CheckoutSummaryDomainLine,
) as typeof CheckoutSummaryDomainLine

export default memo(CheckoutSummary) as typeof CheckoutSummary
