import {
  ellipseAddress,
  convertByteUnits,
  humanReadableSize,
  ellipseText,
} from '@/helpers/utils'
import { Label, StyledArrowIcon, StyledHoldingSummaryLine } from './styles'
import {
  CheckoutSummaryProps,
  CheckoutSummaryVolumeLineProps,
  CheckoutSummaryWebsiteLineProps,
} from './types'
import { memo, useEffect, useMemo, useState } from 'react'
import React from 'react'
import { PaymentMethod } from '@/helpers/constants'
import { VolumeManager, VolumeType } from '@/domain/volume'
import InfoTooltipButton from '../../common/InfoTooltipButton'
import Container from '@/components/common/CenteredContainer'
import { TextGradient, TextInput } from '@aleph-front/core'
import SelectPaymentMethod from '@/components/form/SelectPaymentMethod'
import Price from '@/components/common/Price'
import CheckoutSummaryFooter from '../CheckoutSummaryFooter'
import { AddWebsite, WebsiteManager } from '@/domain/website'
import { useConnection } from '@/hooks/common/useConnection'
import { Blockchain } from '@aleph-sdk/core'
import { useNFTVoucherBalance } from '@/hooks/common/useNFTVoucherBalance'

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
        <div>WEBSITE</div>
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

// @todo: Refactor: Split in different components
export const CheckoutSummary = ({
  address,
  cost,
  paymentMethod,
  unlockedAmount,
  description,
  button: buttonNode,
  footerButton = buttonNode,
  control,
  receiverAddress,
  mainRef,
  disablePaymentMethod = true,
  disabledStreamTooltip,
  onSwitchPaymentMethod,
}: CheckoutSummaryProps) => {
  const { blockchain } = useConnection({
    triggerOnMount: false,
  })
  const nftVoucherBalance = useNFTVoucherBalance()

  const priceDuration = paymentMethod === PaymentMethod.Stream ? 'h' : undefined
  const disabledHold =
    disablePaymentMethod && paymentMethod !== PaymentMethod.Hold
  const disabledStream =
    disablePaymentMethod && paymentMethod !== PaymentMethod.Stream

  const paymentMethodSwitchNode = control && (
    <SelectPaymentMethod
      name="paymentMethod"
      control={control}
      disabledHold={disabledHold}
      disabledStream={disabledStream}
      onSwitch={onSwitchPaymentMethod}
      disabledStreamTooltip={disabledStreamTooltip}
    />
  )

  console.log('{cost?.lines}', cost?.lines)

  return (
    <>
      <div tw="md:mt-32" />
      <CheckoutSummaryFooter
        {...{
          paymentMethod,
          submitButton: footerButton,
          paymentMethodSwitch: paymentMethodSwitchNode,
          mainRef,
          totalCost: cost?.cost,
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
                {nftVoucherBalance > 0 && (
                  <StyledHoldingSummaryLine
                    $isHeader
                    className="tp-body3 fs-12"
                  >
                    <div className="text-main0">NFT VOUCHER</div>
                    <div className="text-main0">
                      {blockchain !== Blockchain.ETH
                        ? 'SWITCH TO ETHEREUM TO CHECK'
                        : 'EXCLUSIVE ALLOCATION'}
                    </div>
                    <div className="text-main0">{nftVoucherBalance} NFT(s)</div>
                  </StyledHoldingSummaryLine>
                )}

                {cost?.lines?.map((line) => (
                  <StyledHoldingSummaryLine key={line.id}>
                    <div>
                      {line.name}
                      {line.label && <Label tw="ml-2" >
                        {line.label}
                      </Label>
                      }
                    </div>
                    {/* <div className="text-main0 tp-body2">{line.detail}</div> */}
                    <div>{line.detail}

                    </div>
                    <div>
                      <span className="text-main0 tp-body3">
                        {line.cost > 0 ? (
                          <Price
                            value={line.cost}
                            duration={
                              cost?.paymentMethod === PaymentMethod.Stream
                                ? 'h'
                                : undefined
                            }
                          />
                        ) : ('-')}
                      </span>
                    </div>
                  </StyledHoldingSummaryLine>
                ))}

                {/* 
                {type === EntityType.Website && costProps.props.website && (
                  <CheckoutSummaryWebsiteLineMemo
                    {...{
                      website: costProps.props.website,
                      cost: (cost as WebsiteCost).totalCost,
                    }}
                  />
                )}
                {type === EntityType.Program && (
                  <StyledHoldingSummaryLine>
                    <div>TYPE</div>
                    <div>
                      {costProps.props.isPersistent
                        ? 'persistent'
                        : 'on-demand'}
                    </div>
                    <div>-</div>
                  </StyledHoldingSummaryLine>
                )}
                {'domains' in costProps.props &&
                  costProps.props.domains &&
                  costProps.props.domains.map((domain) => {
                    return (
                      <CheckoutSummaryDomainLineMemo
                        key={domain.name}
                        domain={domain}
                      />
                    )
                  })} */}
                <StyledHoldingSummaryLine>
                  <div></div>
                  <div className="text-main0 tp-body2">
                    {paymentMethod === PaymentMethod.Hold
                      ? 'Total'
                      : 'Total / h'}
                  </div>
                  <div>
                    <span className="text-main0 tp-body3">
                      <Price value={cost?.cost} />
                    </span>
                  </div>
                </StyledHoldingSummaryLine>
                {paymentMethod === PaymentMethod.Stream && (
                  <StyledHoldingSummaryLine>
                    <div></div>
                    <div className="text-main0 tp-body2">Min. required</div>
                    <div>
                      <span className="text-main0 tp-body3">
                        <Price value={cost?.cost * 4} />
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
                  Balance: <Price value={cost?.cost} /> per hour
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

const CheckoutSummaryVolumeLineMemo = memo(
  CheckoutSummaryVolumeLine,
) as typeof CheckoutSummaryVolumeLine

const CheckoutSummaryWebsiteLineMemo = memo(
  CheckoutSummaryWebsiteLine,
) as typeof CheckoutSummaryWebsiteLine

export default memo(CheckoutSummary) as typeof CheckoutSummary
