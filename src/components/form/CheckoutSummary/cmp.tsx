import { ellipseAddress, humanReadableCurrency } from '@/helpers/utils'
import { Label, StyledHoldingSummaryLine } from './styles'
import { CheckoutSummaryProps } from './types'
import { memo } from 'react'
import React from 'react'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { TextGradient } from '@aleph-front/core'
import CheckoutSummaryFooter from '../CheckoutSummaryFooter'
import { useConnection } from '@/hooks/common/useConnection'
import { Blockchain } from '@aleph-sdk/core'
import { useNFTVoucherBalance } from '@/hooks/common/useNFTVoucherBalance'
import Price from '@/components/common/Price'

// const CheckoutSummaryVolumeLine = ({
//   volume,
//   cost,
//   specs,
//   priceDuration,
// }: CheckoutSummaryVolumeLineProps) => {
//   const [size, setSize] = useState<number>(0)

//   useEffect(() => {
//     async function load() {
//       const size = await VolumeManager.getVolumeSize(volume)
//       setSize(size)
//     }

//     load()
//   }, [volume])

//   if (!cost) return <></>

//   const hasDiscount = !!cost.discount
//   const fullDiscount = !cost.cost

//   return (
//     <StyledHoldingSummaryLine>
//       <div>
//         <div>
//           STORAGE
//           <Label tw="ml-2">
//             {volume.volumeType === VolumeType.Persistent
//               ? 'PERSISTENT'
//               : 'VOLUME'}
//           </Label>
//         </div>
//       </div>
//       <div>
//         <div>{humanReadableSize(size, 'MiB')}</div>
//       </div>
//       <div>
//         <div>
//           {hasDiscount ? (
//             <InfoTooltipButton
//               plain
//               align="left"
//               my="bottom-left"
//               at="bottom-right"
//               tooltipContent={
//                 <div tw="text-left">
//                   <div className="tp-body1 fs-18">
//                     {fullDiscount ? (
//                       <>
//                         The cost displayed for the added storage is{' '}
//                         <span className="text-main0">
//                           <Price value={cost.cost} duration={priceDuration} />
//                         </span>{' '}
//                         as this resource is already included in your selected
//                         package at no additional charge.
//                       </>
//                     ) : (
//                       <>
//                         Good news! The displayed price is lower than usual due
//                         to a discount of{' '}
//                         <span className="text-main0">
//                           <Price
//                             value={cost.price - cost.cost}
//                             duration={priceDuration}
//                           />
//                         </span>
//                         {specs && (
//                           <>
//                             {` for `}
//                             <span className="text-main0">
//                               {convertByteUnits(specs.storage, {
//                                 from: 'MiB',
//                                 to: 'GiB',
//                                 displayUnit: true,
//                               })}
//                             </span>{' '}
//                             included in your package.
//                           </>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </div>
//               }
//             >
//               <Price value={cost.cost} duration={priceDuration} />
//             </InfoTooltipButton>
//           ) : (
//             <>
//               <Price value={cost.cost} duration={priceDuration} />
//             </>
//           )}
//         </div>
//       </div>
//     </StyledHoldingSummaryLine>
//   )
// }
// CheckoutSummaryVolumeLine.displayName = 'CheckoutSummaryVolumeLine'

// // ------------------------------------------

// const CheckoutSummaryWebsiteLine = ({
//   website,
//   cost,
// }: CheckoutSummaryWebsiteLineProps) => {
//   const [size, setSize] = useState<number>(0)

//   useEffect(() => {
//     async function load() {
//       const size = await WebsiteManager.getWebsiteSize({
//         website,
//       } as AddWebsite)
//       setSize(size)
//     }

//     load()
//   }, [website])

//   if (!cost) return <></>

//   return (
//     <StyledHoldingSummaryLine>
//       <div>
//         <div>WEBSITE</div>
//       </div>
//       <div>
//         <div>{humanReadableSize(size, 'MiB')}</div>
//       </div>
//       <div>
//         <Price value={cost} />
//       </div>
//     </StyledHoldingSummaryLine>
//   )
// }
// CheckoutSummaryWebsiteLine.displayName = 'CheckoutSummaryWebsiteLine'

// ------------------------------------------

// @todo: Refactor: Split in different components
export const CheckoutSummary = ({
  address,
  cost,
  unlockedAmount,
  description,
  button: buttonNode,
  footerButton = buttonNode,
  mainRef,
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
                  <div>{humanReadableCurrency(unlockedAmount)}</div>
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
                        loading={cost.loading}
                      />
                    </span>
                  </div>
                </StyledHoldingSummaryLine>
                <StyledHoldingSummaryLine>
                  <div></div>
                  <div className="text-main0 tp-body2">Min. required</div>
                  <div>
                    <span className="text-main0 tp-body3">
                      <Price
                        type="credit"
                        value={
                          cost?.cost?.cost ? cost.cost.cost * 4 : undefined
                        }
                        loading={cost.loading}
                      />
                    </span>
                  </div>
                </StyledHoldingSummaryLine>
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
