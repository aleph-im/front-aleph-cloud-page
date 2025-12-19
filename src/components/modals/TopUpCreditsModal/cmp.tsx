import React, { memo, useEffect } from 'react'
import { Button, Icon, Label, TextGradient, useModal } from '@aleph-front/core'
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
import { UseTopUpCreditsModalFormReturn } from './types'
import PaymentMethodLogos from '@/components/svg/PaymentMethodLogos'
import InfoTooltipButton from '@/components/common/InfoTooltipButton'
import Skeleton from '@/components/common/Skeleton'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'

export const TopUpCreditsModal = () => {
  const { isOpen, handleClose } = useTopUpCreditsModal()
  const {
    handleSubmit,
    errors,
    amountCtrl,
    currencyCtrl,
    bonus,
    totalBalance,
    values,
    isLoadingEstimation,
    isSubmitLoading,
  } = useTopUpCreditsModalForm()

  const modal = useModal()
  const modalOpen = modal?.open

  useEffect(() => {
    if (!isOpen) return

    modalOpen?.({
      width: '30rem',
      onClose: handleClose,
      closeOnCloseButton: false,
      header: <TopUpCreditsModalHeader />,
      content: (
        <TopUpCreditsModalContent
          {...{
            handleSubmit,
            errors,
            amountCtrl,
            currencyCtrl,
            bonus,
            totalBalance,
            values,
            isLoadingEstimation,
            isSubmitLoading,
          }}
        />
      ),
      footer: (
        <TopUpCreditsModalFooter
          {...{ values, handleSubmit, isSubmitLoading }}
        />
      ),
    })
  }, [modalOpen, isOpen, handleSubmit, values, errors, bonus, totalBalance])

  return null
}

TopUpCreditsModal.displayName = 'TopUpCreditsModal'

export default memo(TopUpCreditsModal)

// --------

type TopUpCreditsModalContentProps = Pick<
  UseTopUpCreditsModalFormReturn,
  | 'handleSubmit'
  | 'errors'
  | 'amountCtrl'
  | 'currencyCtrl'
  | 'bonus'
  | 'totalBalance'
  | 'values'
  | 'isLoadingEstimation'
  | 'isSubmitLoading'
>

const TopUpCreditsModalContent = memo(
  ({
    handleSubmit,
    errors,
    amountCtrl,
    currencyCtrl,
    bonus,
    totalBalance,
    values,
    isLoadingEstimation,
    isSubmitLoading,
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
                  ) : (
                    '$'
                  )}
                </StyledDollarSymbol>
                <StyledAmountInput
                  {...amountCtrl.field}
                  type="number"
                  placeholder="100"
                  min={100}
                  step={1}
                />
              </StyledAmountInputWrapper>
              <StyledBonusText>
                {isLoadingEstimation ? (
                  <Skeleton width="8rem" height="1em" color="main0" />
                ) : (
                  <>~ ${bonus} bonus</>
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
                  <>~ ${totalBalance} balance</>
                )}
              </StyledReceiveAmount>
            </StyledReceiveBox>
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
                      </span>
                      <Label kind="primary" variant="success">
                        +20% extra balance
                      </Label>
                    </span>
                  ) as unknown as string
                }
              />
              <StyledRadio
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
                    </span>
                  ) as unknown as string
                }
              />
              <StyledRadio
                disabled
                value="CARD"
                label={
                  (
                    <span tw="flex gap-4 justify-start items-center">
                      Credit Card / SEPA <PaymentMethodLogos />
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

type TopUpCreditsModalFooterProps = Pick<
  UseTopUpCreditsModalFormReturn,
  'handleSubmit' | 'values' | 'isSubmitLoading'
>

const TopUpCreditsModalFooter = memo(
  ({ values, handleSubmit, isSubmitLoading }: TopUpCreditsModalFooterProps) => {
    return (
      <div tw="flex gap-4 justify-center">
        {/* <Button type="button" variant="secondary" onClick={handleClose}>
        Cancel
      </Button> */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!values.amount || values.amount < 100 || isSubmitLoading}
          onClick={handleSubmit}
        >
          Confirm & Add Balance <Icon name="arrow-right" />
        </Button>
      </div>
    )
  },
)
