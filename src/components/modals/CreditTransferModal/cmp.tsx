import React, { memo, useCallback, useState } from 'react'
import 'twin.macro'
import { Button, Icon, Modal, TextGradient, TextInput } from '@aleph-front/core'
import { useCreditTransferModal, useCreditTransferForm } from './hook'
import { useConnection } from '@/hooks/common/useConnection'
import { formatCredits } from '@/helpers/utils'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'

type Recipient = {
  address: string
  amount: string
  expiration: string
}

const emptyRecipient: Recipient = {
  address: '',
  amount: '',
  expiration: '',
}

const CreditTransferModal = () => {
  const { isOpen, handleClose } = useCreditTransferModal()
  const { handleSubmit, loading, error } = useCreditTransferForm()
  const { creditBalance } = useConnection({ triggerOnMount: false })

  const [recipients, setRecipients] = useState<Recipient[]>([
    { ...emptyRecipient },
  ])
  const [formError, setFormError] = useState<string | null>(null)

  const handleRecipientChange = useCallback(
    (index: number, field: keyof Recipient, value: string) => {
      setRecipients((prev) => {
        const next = [...prev]
        next[index] = { ...next[index], [field]: value }
        return next
      })
      setFormError(null)
    },
    [],
  )

  const handleAddRecipient = useCallback(() => {
    setRecipients((prev) => [...prev, { ...emptyRecipient }])
  }, [])

  const handleRemoveRecipient = useCallback((index: number) => {
    setRecipients((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const validate = useCallback(() => {
    for (const r of recipients) {
      if (!r.address || !r.address.startsWith('0x') || r.address.length < 42) {
        setFormError('Invalid Ethereum address')
        return false
      }
      const amount = Number(r.amount)
      if (!amount || amount <= 0) {
        setFormError('Amount must be greater than 0')
        return false
      }
    }

    const totalAmount = recipients.reduce((sum, r) => sum + Number(r.amount), 0)

    if (creditBalance && totalAmount > creditBalance) {
      setFormError('Total amount exceeds your balance')
      return false
    }

    return true
  }, [recipients, creditBalance])

  const onSubmit = useCallback(async () => {
    if (!validate()) return

    try {
      await handleSubmit({
        recipients: recipients.map((r) => ({
          address: r.address,
          amount: Number(r.amount),
          ...(r.expiration && { expiration: r.expiration }),
        })),
      })
      setRecipients([{ ...emptyRecipient }])
    } catch (err) {
      setFormError((err as Error).message)
    }
  }, [validate, handleSubmit, recipients])

  const handleModalClose = useCallback(() => {
    setRecipients([{ ...emptyRecipient }])
    setFormError(null)
    handleClose()
  }, [handleClose])

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
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
          {creditBalance !== undefined && (
            <p className="tp-body3 text-base2" tw="mt-2">
              Available: {formatCredits(creditBalance)}
            </p>
          )}
        </div>
      }
      content={
        <div tw="flex flex-col gap-4">
          {recipients.map((r, index) => (
            <div
              key={index}
              tw="flex flex-col gap-3 pb-4"
              css={
                index > 0
                  ? 'border-top: 1px solid rgba(255,255,255,0.1);padding-top:1rem;'
                  : ''
              }
            >
              {recipients.length > 1 && (
                <div tw="flex items-center justify-between">
                  <span className="tp-body2">Recipient {index + 1}</span>
                </div>
              )}
              <TextInput
                name={`address-${index}`}
                label="Recipient Address"
                placeholder="0x..."
                value={r.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRecipientChange(index, 'address', e.target.value)
                }
              />
              <TextInput
                name={`amount-${index}`}
                label="Amount (credits)"
                placeholder="1000000"
                type="number"
                value={r.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRecipientChange(index, 'amount', e.target.value)
                }
              />
              <TextInput
                name={`expiration-${index}`}
                label="Expiration (optional)"
                type="date"
                value={r.expiration}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRecipientChange(index, 'expiration', e.target.value)
                }
              />
              {recipients.length > 1 && (
                <div tw="mt-4 pt-6 text-right">
                  <Button
                    type="button"
                    kind="functional"
                    variant="warning"
                    size="md"
                    onClick={() => handleRemoveRecipient(index)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}

          <div tw="text-center">
            <Button
              type="button"
              color="main0"
              kind="gradient"
              variant="secondary"
              size="md"
              onClick={handleAddRecipient}
            >
              Add recipient <Icon name="plus-circle" />
            </Button>
          </div>

          {(formError || error) && (
            <p className="tp-body2 text-error" tw="mt-2">
              <Icon name="exclamation-triangle" tw="mr-2" />
              {formError || error?.message}
            </p>
          )}

          <SpinnerOverlay show={loading} center size="8rem" />
        </div>
      }
      footer={
        <div tw="flex justify-center">
          <Button
            variant="primary"
            size="md"
            disabled={loading}
            onClick={onSubmit}
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
