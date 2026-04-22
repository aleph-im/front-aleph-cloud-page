import React, { memo } from 'react'
import 'twin.macro'
import { Button, Icon, Modal, TextGradient, TextInput } from '@aleph-front/core'
import { useController } from 'react-hook-form'
import { useCreditTransferModal, useCreditTransferModalForm } from './hook'
import { formatCredits } from '@/helpers/utils'
import { CREDITS_PER_USD } from '@/domain/credit'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import { Form } from '@/components/form/Form'

const CreditTransferModal = () => {
  const { isOpen, handleClose } = useCreditTransferModal()
  const {
    control,
    handleSubmit,
    errors,
    isSubmitLoading,
    fieldArray,
    balanceDollars,
    handleFillMax,
  } = useCreditTransferModalForm()

  const { fields, append, remove } = fieldArray

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      closeOnCloseButton={false}
      width="32rem"
      header={
        <div>
          <TextGradient type="h6" forwardedAs="h2" tw="mb-2">
            Transfer Credits
          </TextGradient>
          <p tw="m-0">
            Send credits to another account. Transfers are processed on the
            Aleph network.
          </p>
          <p className="tp-body3 text-base2" tw="mt-2">
            Available: {formatCredits(balanceDollars * CREDITS_PER_USD)}
          </p>
        </div>
      }
      content={
        <Form onSubmit={handleSubmit} errors={errors}>
          <div tw="flex flex-col gap-4 px-4">
            {fields.map((field, index) => (
              <RecipientRow
                key={field.id}
                index={index}
                control={control}
                showRemove={fields.length > 1}
                onRemove={() => remove(index)}
                onFillMax={() => handleFillMax(index)}
              />
            ))}

            <div tw="text-center">
              <Button
                type="button"
                color="main0"
                kind="gradient"
                variant="secondary"
                size="md"
                onClick={() =>
                  append({
                    address: '',
                    amount: '' as unknown as number,
                    expiration: '',
                  })
                }
              >
                Add recipient <Icon name="plus-circle" />
              </Button>
            </div>

            <SpinnerOverlay show={isSubmitLoading} center size="8rem" />
          </div>
        </Form>
      }
      footer={
        <div tw="flex justify-center">
          <Button
            variant="primary"
            size="md"
            disabled={isSubmitLoading}
            onClick={handleSubmit}
          >
            Confirm Transfer <Icon name="arrow-right" />
          </Button>
        </div>
      }
    />
  )
}
CreditTransferModal.displayName = 'CreditTransferModal'

export default memo(CreditTransferModal)

// --- Recipient row sub-component ---

type RecipientRowProps = {
  index: number
  control: any
  showRemove: boolean
  onRemove: () => void
  onFillMax: () => void
}

const RecipientRow = memo(
  ({ index, control, showRemove, onRemove, onFillMax }: RecipientRowProps) => {
    const addressCtrl = useController({
      control,
      name: `recipients.${index}.address`,
    })
    const amountCtrl = useController({
      control,
      name: `recipients.${index}.amount`,
    })
    const expirationCtrl = useController({
      control,
      name: `recipients.${index}.expiration`,
    })

    return (
      <div
        tw="flex flex-col gap-3 pb-4"
        css={
          showRemove
            ? 'border-top: 1px solid rgba(255,255,255,0.1);padding-top:1rem;'
            : ''
        }
      >
        {showRemove && (
          <div tw="flex items-center justify-between">
            <span className="tp-body2">Recipient {index + 1}</span>
          </div>
        )}
        <TextInput
          {...addressCtrl.field}
          name={`address-${index}`}
          label="Recipient Address"
          placeholder="0x..."
          error={addressCtrl.fieldState.error}
        />
        <TextInput
          {...amountCtrl.field}
          value={amountCtrl.field.value || ''}
          name={`amount-${index}`}
          label="Amount ($)"
          placeholder="10.50"
          type="number"
          step="any"
          error={amountCtrl.fieldState.error}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value
            amountCtrl.field.onChange(raw === '' ? '' : raw)
          }}
          button={
            <Button
              type="button"
              variant="textOnly"
              size="sm"
              onClick={onFillMax}
              tw="mr-2!"
            >
              Max
            </Button>
          }
        />
        <TextInput
          {...expirationCtrl.field}
          name={`expiration-${index}`}
          label="Expiration (optional)"
          type="date"
        />
        {showRemove && (
          <div tw="mt-4 pt-6 text-right">
            <Button
              type="button"
              kind="functional"
              variant="warning"
              size="md"
              onClick={onRemove}
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    )
  },
)
RecipientRow.displayName = 'RecipientRow'
