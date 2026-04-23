import React, { memo, useMemo } from 'react'
import { StyledLine } from './styles'
import { AccountInformationProps } from './types'
import {
  Logo,
  ellipseText,
  formatCurrency,
  Icon,
  Button,
} from '@aleph-front/core'
import { useTheme } from 'styled-components'
import Price from '@/components/common/Price'
import CopyToClipboardIcon from '@/components/common/CopyToClipboardIcon'
import ExternalUrl from '../ExternalUrl'

export const AccountInformation = ({
  vouchers,
  showCredits,
  credits,
  balance,
  rewards,
  accountAddress,
  accountAddressHref,
  showExternalUrl,
  externalUrl,
  disabledTopUp,
  handleTopUpClick,
  Link,
}: AccountInformationProps) => {
  const theme = useTheme()
  const { color } = theme.component.walletPicker

  const displayBalance = useMemo(() => formatCurrency(balance), [balance])
  const displayAddress = useMemo(
    () => `${accountAddress?.slice(0, 8)}...${accountAddress?.slice(-6)}`,
    [accountAddress],
  )

  return (
    <>
      {showCredits && (
        <>
          <div className="fs-10 tp-info" tw="mb-2">
            CREDITS
          </div>
          <div tw="flex justify-between">
            <div
              className="tp-code1 fs-24 text-main0"
              tw="whitespace-nowrap leading-4! flex items-center gap-2 leading-3"
            >
              {credits}
            </div>
            <Button
              kind="yellow"
              variant="textOnly"
              disabled={disabledTopUp}
              onClick={handleTopUpClick}
            >
              Top up
              <Icon size="lg" name="square-chevron-right" tw="ml-1" />
            </Button>
          </div>
          <StyledLine />
        </>
      )}

      <div className="fs-10 tp-info" tw="mb-2">
        WALLET
      </div>
      <div
        className="tp-code1 fs-24 text-main0"
        tw="whitespace-nowrap leading-4! flex items-center gap-2 leading-3"
      >
        {displayBalance}
        <Logo img="aleph" color="main0" size="1em" />
      </div>
      {accountAddressHref ? (
        <div tw="flex items-center gap-2">
          {accountAddressHref ? (
            <Link
              href={accountAddressHref}
              target="_blank"
              route={{ href: accountAddressHref }}
            >
              <div tw="flex items-center gap-2 italic">
                {ellipseText(accountAddress || '', 12, 12)}
                <Icon size="lg" name="external-link-square-alt" />
              </div>
            </Link>
          ) : (
            <span tw="flex items-center w-full">{accountAddress}</span>
          )}
          <CopyToClipboardIcon text={accountAddress} />
        </div>
      ) : (
        displayAddress
      )}

      {rewards && (
        <>
          <StyledLine />
          <div tw="flex items-start justify-between gap-4">
            <span className="fs-10 tp-body3" tw="opacity-60 mt-1">
              EST. REWARDS
            </span>
            <div tw="text-right">
              <Price
                value={rewards.amount}
                className="fs-16 tp-body3"
                css={{ color: color.rewards }}
              />
              <div className="fs-12 tp-body1" tw="opacity-60">
                Next distribution in {rewards.days} days
              </div>
            </div>
          </div>
        </>
      )}

      {vouchers && (
        <>
          <StyledLine />
          <div tw="flex flex-col gap-6">
            {vouchers &&
              vouchers.map((voucher) => (
                <div tw="flex items-center justify-between" key={voucher.name}>
                  <div tw="flex items-center gap-2 max-w-sm ">
                    <img
                      src={voucher.image}
                      alt={voucher.imageAlt}
                      tw="w-12 h-12"
                    />
                    <div className="fs-16 tp-body3" tw="line-clamp-1">
                      {voucher.name}
                    </div>
                  </div>
                  <div tw="text-right pl-2" className="tp-body">
                    x{voucher.amount}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {showExternalUrl && externalUrl && (
        <>
          <StyledLine />

          <ExternalUrl
            Link={Link}
            text={externalUrl.text}
            url={externalUrl.url}
          />
        </>
      )}
    </>
  )
}
AccountInformation.displayName = 'AccountInformation'

export default memo(AccountInformation) as typeof AccountInformation
