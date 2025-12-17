import React, { useCallback } from 'react'
import { Button, Radio, RadioGroup, TextGradient } from '@aleph-front/core'
import { Form } from '@/components/form/Form'
import { useTopUpCreditsModal } from './hook'
import {
  StyledAmountInputContainer,
  StyledAmountInputWrapper,
  StyledAmountInput,
  StyledDollarSymbol,
  StyledBonusText,
  StyledReceiveBox,
  StyledReceiveLabel,
  StyledReceiveAmount,
} from './styles'

export type TopUpCreditsModalProps = {
  onClose?: () => void
}

export const TopUpCreditsModal = ({ onClose }: TopUpCreditsModalProps) => {
  const {
    values,
    amountCtrl,
    currencyCtrl,
    errors,
    handleSubmit,
    bonus,
    totalBalance,
  } = useTopUpCreditsModal()

  const handleClose = useCallback(() => {
    // resetForm()
    onClose?.()
  }, [onClose])

  return (
    <Form onSubmit={handleSubmit} errors={errors}>
      {/* {JSON.stringify(values, null, 2)} */}
      <div tw="flex flex-col gap-10">
        <div>
          <TextGradient type="h6" forwardedAs="h2" tw="mb-2">
            Add Balance
          </TextGradient>
          <p tw="m-0">
            You&apos;ll be billed in your selected currency. Your balance stays
            available for future cloud usage.
          </p>
        </div>

        <div>
          <TextGradient type="h7" forwardedAs="h2" tw="mb-2">
            Amount to add
          </TextGradient>
          <StyledAmountInputContainer>
            <StyledAmountInputWrapper>
              <StyledDollarSymbol>$</StyledDollarSymbol>
              <StyledAmountInput
                {...amountCtrl.field}
                type="number"
                placeholder="100"
                min={0}
                step={0.01}
              />
              {bonus > 0 && (
                <StyledBonusText>${bonus.toFixed(2)} bonus</StyledBonusText>
              )}
            </StyledAmountInputWrapper>
            <StyledReceiveBox>
              <StyledReceiveLabel>RECEIVE</StyledReceiveLabel>
              <StyledReceiveAmount>
                ${totalBalance.toFixed(2)} balance
              </StyledReceiveAmount>
            </StyledReceiveBox>
          </StyledAmountInputContainer>
        </div>

        <div>
          <TextGradient type="h7" forwardedAs="h2" tw="mb-2">
            Choose payment method
          </TextGradient>
          <div tw="flex flex-col gap-3">
            <div tw="flex flex-col gap-2">
              <RadioGroup
                {...currencyCtrl.field}
                {...currencyCtrl.fieldState}
                required
                direction="column"
              >
                <Radio label="ALEPH" value="ALEPH" />
                <Radio label="USDC" value="USDC" />
                <Radio label="Card (Coming Soon)" value="CARD" disabled />
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div tw="flex gap-4 justify-end">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" onClick={handleSubmit}>
            Pay {values.amount > 0 ? `${values.amount} ${values.currency}` : ''}
          </Button>
        </div>
      </div>
    </Form>
  )
}

TopUpCreditsModal.displayName = 'TopUpCreditsModal'

export default TopUpCreditsModal // memo(TopUpCreditsModal)
