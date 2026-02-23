import { ellipseAddress, formatCredits } from '@/helpers/utils'
import { Label, StyledHoldingSummaryLine } from './styles'
import BorderBox from '@/components/common/BorderBox'
import { CheckoutSummaryProps } from './types'
import { memo } from 'react'
import React from 'react'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { Button, Icon, TextGradient } from '@aleph-front/core'
import CheckoutSummaryFooter from '../CheckoutSummaryFooter'
import { useConnection } from '@/hooks/common/useConnection'
import { Blockchain } from '@aleph-sdk/core'
import { useNFTVoucherBalance } from '@/hooks/common/useNFTVoucherBalance'
import Price from '@/components/common/Price'

export const CheckoutSummary = ({
  address,
  cost,
  unlockedAmount,
  description,
  button: buttonNode,
  footerButton = buttonNode,
  mainRef,
  minimumBalanceNeeded,
  insufficientFunds,
}: CheckoutSummaryProps) => {
  const { blockchain } = useConnection({
    triggerOnMount: false,
  })
  const nftVoucherBalance = useNFTVoucherBalance()

  return (
    <>
      <CheckoutSummaryFooter
        {...{
          submitButton: footerButton,
          mainRef,
          totalCost: cost?.cost?.cost,
          loading: cost.loading,
        }}
      />
      <section
        className="fx-noise-light fx-grain-4"
        tw="px-0 pt-6 pb-24 md:pt-16 md:pb-32 md:mt-auto"
      >
        <CenteredContainer>
          <div className="bg-base1" tw="p-6">
            <TextGradient forwardedAs="h2" type="h5" tw="mb-1">
              Checkout summary
            </TextGradient>
            {description && (
              <div tw="mt-1 mb-6">
                <p className="text-main2">{description}</p>
              </div>
            )}

            <div tw="my-6 p-6">
              <div tw="max-w-full overflow-auto">
                <StyledHoldingSummaryLine $isHeader className="tp-body3 fs-12">
                  <div>AVAILABLE CREDITS</div>
                  <div>CURRENT WALLET {ellipseAddress(address)}</div>
                  <div>{formatCredits(unlockedAmount)}</div>
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

                {cost?.cost?.lines?.map((line) => (
                  <StyledHoldingSummaryLine key={line.id}>
                    <div>
                      {line.name}
                      {line.label && <Label tw="ml-2">{line.label}</Label>}
                    </div>
                    {/* <div className="text-main0 tp-body2">{line.detail}</div> */}
                    <div>{line.detail}</div>
                    <div>
                      <span>
                        {line.cost !== 0 ? (
                          <Price
                            type="credit"
                            value={line.cost}
                            duration="h"
                            decimals={6}
                            className="tp-body3"
                            loading={cost.loading}
                          />
                        ) : (
                          '-'
                        )}
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
                  <div className="text-main0 tp-body2">Total credits / h</div>
                  <div>
                    <span className="text-main0">
                      <Price
                        type="credit"
                        value={cost?.cost?.cost}
                        duration="h"
                        decimals={6}
                        loading={cost.loading}
                      />
                    </span>
                  </div>
                </StyledHoldingSummaryLine>
                <StyledHoldingSummaryLine>
                  <div></div>
                  <div className="text-main0 tp-body2">Min. required (24h)</div>
                  <div>
                    <span className="text-main0 tp-body3">
                      <Price
                        type="credit"
                        value={minimumBalanceNeeded}
                        decimals={6}
                        loading={cost.loading}
                      />
                    </span>
                  </div>
                </StyledHoldingSummaryLine>

                {cost.error && (
                  <BorderBox $color="error" tw="mt-4">
                    <div tw="flex flex-col gap-3">
                      <p className="tp-body1 fs-16">
                        <strong>Validation Error:</strong> {cost.error}
                      </p>
                    </div>
                  </BorderBox>
                )}

                {insufficientFunds?.hasInsufficientFunds && (
                  <BorderBox $color="error" tw="mt-4">
                    <div tw="flex flex-col gap-3">
                      <p className="tp-body1 fs-16">
                        Your balance is too low to deploy this resource. You
                        need a minimum of{' '}
                        <strong>
                          {formatCredits(
                            insufficientFunds.minimumBalanceNeeded,
                          )}
                        </strong>{' '}
                        to run for 24 hours.
                      </p>
                      <div>
                        <Button
                          type="button"
                          kind="default"
                          variant="textOnly"
                          size="md"
                          color="main0"
                          onClick={insufficientFunds.onTopUpClick}
                        >
                          Top up credits
                          <Icon name="arrow-right" tw="ml-2" />
                        </Button>
                      </div>
                    </div>
                  </BorderBox>
                )}
              </div>
            </div>

            {buttonNode && <div tw="mt-16 text-center">{buttonNode}</div>}
          </div>
        </CenteredContainer>
      </section>
    </>
  )
}

export default memo(CheckoutSummary) as typeof CheckoutSummary
