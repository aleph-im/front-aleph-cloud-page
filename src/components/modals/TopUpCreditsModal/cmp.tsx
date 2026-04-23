import React, { memo } from 'react'
import { Icon, Label, Modal, TextGradient } from '@aleph-front/core'
import ButtonWithInfoTooltip from '@/components/common/ButtonWithInfoTooltip'
import { Form } from '@/components/form/Form'
import { useTopUpCreditsModal, useTopUpCreditsModalForm } from './hook'
import {
  StyledAmountInputWrapper,
  StyledAmountInput,
  StyledDollarSymbol,
  StyledBonusText,
  StyledReceiveBox,
  StyledReceiveLabel,
  StyledReceiveAmount,
  StyledSendBox,
  StyledRadio,
  StyledRadioGroup,
  StyledSendTitle,
} from './styles'
import {
  UseTopUpCreditsModalFormProps,
  UseTopUpCreditsModalFormReturn,
} from './types'
import PaymentMethodLogos from '@/components/svg/PaymentMethodLogos'
import InfoTooltipButton from '@/components/common/InfoTooltipButton'
import Skeleton from '@/components/common/Skeleton'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import { useCreditPaymentHistory } from '@/hooks/common/useCreditPaymentHistory'
import { formatCredits } from '@/helpers/utils'

export type TopUpCreditsModalProps = Omit<
  UseTopUpCreditsModalFormProps,
  'refetchPaymentHistory'
>

export const TopUpCreditsModal = ({ onSuccess }: TopUpCreditsModalProps) => {
  const { isOpen, handleClose } = useTopUpCreditsModal()
  const { refetch: refetchPaymentHistory } = useCreditPaymentHistory()
  const {
    handleSubmit,
    errors,
    amountCtrl,
    handleAmountChange,
    currencyCtrl,
    bonus,
    totalBalance,
    values,
    isLoadingEstimation,
    isSubmitLoading,
    minimumCreditsNeeded,
    minimumTokenAmount,
    isBelowMinimumCredits,
    showInsufficientWarning,
    isSubmitDisabled,
    isEthereumNetwork,
    getEthereumNetworkTooltip,
    isGasSponsored,
    isPrivyConnection,
    alephEnabled,
    ethEnabled,
    usdcEnabled,
    alephDisabledReason,
    ethDisabledReason,
    usdcDisabledReason,
    cardDisabledReason,
  } = useTopUpCreditsModalForm({ onSuccess, refetchPaymentHistory })

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      closeOnCloseButton={false}
      width="30rem"
      header={<TopUpCreditsModalHeader />}
      content={
        <TopUpCreditsModalContent
          {...{
            handleSubmit,
            errors,
            amountCtrl,
            handleAmountChange,
            currencyCtrl,
            bonus,
            totalBalance,
            values,
            isLoadingEstimation,
            isSubmitLoading,
            minimumCreditsNeeded,
            minimumTokenAmount,
            isBelowMinimumCredits,
            showInsufficientWarning,
            isPrivyConnection,
            alephEnabled,
            ethEnabled,
            usdcEnabled,
            alephDisabledReason,
            ethDisabledReason,
            usdcDisabledReason,
            cardDisabledReason,
          }}
        />
      }
      footer={
        <TopUpCreditsModalFooter
          {...{
            handleSubmit,
            isSubmitDisabled,
            isEthereumNetwork,
            getEthereumNetworkTooltip,
            isGasSponsored,
          }}
        />
      }
    />
  )
}

TopUpCreditsModal.displayName = 'TopUpCreditsModal'

export default memo(TopUpCreditsModal)

// --------

type TopUpCreditsModalContentProps = Pick<
  UseTopUpCreditsModalFormReturn,
  | 'handleSubmit'
  | 'errors'
  | 'amountCtrl'
  | 'handleAmountChange'
  | 'currencyCtrl'
  | 'bonus'
  | 'totalBalance'
  | 'values'
  | 'isLoadingEstimation'
  | 'isSubmitLoading'
  | 'minimumCreditsNeeded'
  | 'minimumTokenAmount'
  | 'isBelowMinimumCredits'
  | 'showInsufficientWarning'
  | 'isPrivyConnection'
  | 'alephEnabled'
  | 'ethEnabled'
  | 'usdcEnabled'
  | 'alephDisabledReason'
  | 'ethDisabledReason'
  | 'usdcDisabledReason'
  | 'cardDisabledReason'
>

const TopUpCreditsModalContent = memo(
  ({
    handleSubmit,
    errors,
    amountCtrl,
    handleAmountChange,
    currencyCtrl,
    bonus,
    totalBalance,
    values,
    isLoadingEstimation,
    isSubmitLoading,
    minimumCreditsNeeded,
    minimumTokenAmount,
    isBelowMinimumCredits,
    showInsufficientWarning,
    isPrivyConnection,
    alephEnabled,
    ethEnabled,
    usdcEnabled,
    alephDisabledReason,
    ethDisabledReason,
    usdcDisabledReason,
    cardDisabledReason,
  }: TopUpCreditsModalContentProps) => {
    return (
      <Form onSubmit={handleSubmit} errors={errors}>
        {/* {JSON.stringify(values, null, 2)} */}
        <div tw="flex flex-col gap-6">
          <div>
            <StyledSendTitle>
              <TextGradient type="h7" forwardedAs="h2" tw="mb-0">
                Amount to add
              </TextGradient>
              <InfoTooltipButton
                plain
                my="top-left"
                at="top-right"
                iconSize=".75rem"
                tooltipContent="Internally your balance becomes usage units. Since these units aren’t a traded asset, they can’t be redeemed for money."
              />
            </StyledSendTitle>
            <StyledSendBox>
              <StyledAmountInputWrapper>
                <StyledDollarSymbol>
                  {values.currency === 'ALEPH' ? (
                    <Icon prefix="custom" name="aleph" size="100%" />
                  ) : values.currency === 'USDC' ? (
                    <Icon prefix="custom" name="usdc" size="100%" />
                  ) : values.currency === 'ETH' ? (
                    'Ξ'
                  ) : (
                    '$'
                  )}
                </StyledDollarSymbol>
                <StyledAmountInput
                  {...amountCtrl.field}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleAmountChange(Number(e.target.value))
                  }
                  type="number"
                  placeholder={minimumTokenAmount.toString() || '100'}
                  min={1}
                  step={1}
                />
              </StyledAmountInputWrapper>
              <StyledBonusText>
                {isLoadingEstimation ? (
                  <Skeleton width="8rem" height="1em" color="main0" />
                ) : (
                  <>~ {formatCredits(bonus)} bonus</>
                )}
              </StyledBonusText>
            </StyledSendBox>
            <StyledReceiveBox>
              <StyledReceiveLabel>
                RECEIVE
                <InfoTooltipButton
                  plain
                  my="top-left"
                  at="top-right"
                  tooltipContent={
                    <div className="tp-body1 fs-12">
                      <div tw="mb-8">
                        <div className="tp-body2 fs-16">
                          For USDC purchases:
                        </div>
                        Displayed balances are an estimate. Final amount may
                        change slightly due to market price movements during
                        USDC → ALEPH conversion.
                      </div>
                      <div>
                        <div className="tp-body2 fs-16">
                          For card purchases:
                        </div>
                        Displayed balances are an estimate. Final amount may
                        change slightly after payment processing fees and
                        currency conversion.
                      </div>
                    </div>
                  }
                />
              </StyledReceiveLabel>
              <StyledReceiveAmount>
                {isLoadingEstimation ? (
                  <Skeleton width="14rem" height="1em" color="main0" />
                ) : (
                  <>~ {formatCredits(totalBalance)} balance</>
                )}
              </StyledReceiveAmount>
            </StyledReceiveBox>
            {showInsufficientWarning && minimumCreditsNeeded && (
              <div className="tp-body2 fs-12 text-error" tw="mt-2 p-3 rounded">
                <Icon name="exclamation-triangle" tw="mr-2" />
                Minimum {formatCredits(minimumCreditsNeeded)} required for this
                operation. Please increase the amount.
              </div>
            )}
            {isBelowMinimumCredits && !showInsufficientWarning && (
              <div className="tp-body2 fs-12 text-error" tw="mt-2 p-3 rounded">
                <Icon name="exclamation-triangle" tw="mr-2" />
                Minimum top-up is $1. Please enter at least {
                  minimumTokenAmount
                }{' '}
                {values.currency}.
              </div>
            )}
          </div>
          <div>
            <TextGradient type="h7" forwardedAs="h2" tw="mb-4">
              Choose payment method
            </TextGradient>
            <StyledRadioGroup
              {...currencyCtrl.field}
              {...currencyCtrl.fieldState}
              required
              direction="column"
            >
              <StyledRadio
                disabled={!alephEnabled}
                value="ALEPH"
                label={
                  (
                    <span tw="flex justify-between items-center">
                      <span tw="flex gap-4 justify-start items-center">
                        ALEPH
                        <Icon
                          prefix="custom"
                          name="aleph"
                          size="100%"
                          className="text-main0"
                        />
                        {!alephEnabled && alephDisabledReason && (
                          <InfoTooltipButton
                            plain
                            my="top-left"
                            at="top-right"
                            iconSize=".75rem"
                            tooltipContent={alephDisabledReason}
                          />
                        )}
                      </span>
                      <Label kind="primary" variant="success">
                        +20% extra balance
                      </Label>
                    </span>
                  ) as unknown as string
                }
              />
              <StyledRadio
                disabled={!ethEnabled}
                value="ETH"
                label={
                  (
                    <span tw="flex gap-4 justify-start items-center">
                      ETH
                      {!ethEnabled && ethDisabledReason && (
                        <InfoTooltipButton
                          plain
                          my="top-left"
                          at="top-right"
                          iconSize=".75rem"
                          tooltipContent={ethDisabledReason}
                        />
                      )}
                    </span>
                  ) as unknown as string
                }
              />
              <StyledRadio
                disabled={!usdcEnabled}
                value="USDC"
                label={
                  (
                    <span tw="flex gap-4 justify-start items-center">
                      USDC
                      <Icon
                        prefix="custom"
                        name="usdc"
                        size="100%"
                        className="text-main0"
                      />
                      {!usdcEnabled && usdcDisabledReason && (
                        <InfoTooltipButton
                          plain
                          my="top-left"
                          at="top-right"
                          iconSize=".75rem"
                          tooltipContent={usdcDisabledReason}
                        />
                      )}
                    </span>
                  ) as unknown as string
                }
              />
              <StyledRadio
                disabled={!isPrivyConnection}
                value="CARD"
                label={
                  (
                    <span tw="flex gap-4 justify-start items-center">
                      Credit Card / SEPA <PaymentMethodLogos />
                      {!isPrivyConnection && cardDisabledReason && (
                        <InfoTooltipButton
                          plain
                          my="top-left"
                          at="top-right"
                          iconSize=".75rem"
                          tooltipContent={cardDisabledReason}
                        />
                      )}
                    </span>
                  ) as unknown as string
                }
              />
            </StyledRadioGroup>
          </div>
          <SpinnerOverlay show={isSubmitLoading} center size="12rem" />
        </div>
      </Form>
    )
  },
)
TopUpCreditsModalContent.displayName = 'TopUpCreditsModalContent'

const TopUpCreditsModalHeader = memo(() => {
  return (
    <div>
      <TextGradient type="h6" forwardedAs="h2" tw="mb-2">
        Add Balance
      </TextGradient>
      <p tw="m-0">
        You&apos;ll be billed in your selected currency. Your balance stays
        available for future cloud usage.
      </p>
    </div>
  )
})
TopUpCreditsModalHeader.displayName = 'TopUpCreditsModalHeader'

type TopUpCreditsModalFooterProps = Pick<
  UseTopUpCreditsModalFormReturn,
  | 'handleSubmit'
  | 'isSubmitDisabled'
  | 'isEthereumNetwork'
  | 'getEthereumNetworkTooltip'
  | 'isGasSponsored'
>

const TopUpCreditsModalFooter = memo(
  ({
    handleSubmit,
    isSubmitDisabled,
    getEthereumNetworkTooltip,
    isGasSponsored,
  }: TopUpCreditsModalFooterProps) => {
    return (
      <div tw="flex flex-col items-center gap-2">
        <ButtonWithInfoTooltip
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
          tooltipContent={getEthereumNetworkTooltip()}
        >
          Confirm & Add Balance <Icon name="arrow-right" />
        </ButtonWithInfoTooltip>
        {isGasSponsored && (
          <p className="tp-body3 fs-12 text-main0" tw="m-0">
            <Icon name="bolt" size="sm" tw="mr-1" />
            Gas sponsored by Aleph — no ETH needed
          </p>
        )}
      </div>
    )
  },
)
TopUpCreditsModalFooter.displayName = 'TopUpCreditsModalFooter'
