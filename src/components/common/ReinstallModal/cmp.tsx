import React, { memo, useState } from 'react'
import 'twin.macro'
import { Button, Modal, TextGradient, TextInput } from '@aleph-front/core'

export type ReinstallModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  instanceName: string
}

export const ReinstallModal = ({
  open,
  onClose,
  onConfirm,
  instanceName,
}: ReinstallModalProps) => {
  const [confirmText, setConfirmText] = useState('')

  const canConfirm = confirmText === instanceName

  const handleClose = () => {
    setConfirmText('')
    onClose()
  }

  const handleConfirm = () => {
    if (!canConfirm) return
    setConfirmText('')
    onConfirm()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      width="32rem"
      header={
        <div>
          <TextGradient type="h6" forwardedAs="h2" tw="mb-2">
            Reinstall instance?
          </TextGradient>
          <p tw="m-0">
            This wipes the instance disk and reinstalls the OS from the base
            image. All data on the VM will be permanently lost. This cannot be
            undone.
          </p>
        </div>
      }
      content={
        <div tw="flex flex-col gap-2 px-4">
          <p className="tp-body3 text-base2" tw="m-0">
            Type <strong>{instanceName}</strong> to confirm:
          </p>
          <TextInput
            name="reinstall-confirm"
            value={confirmText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmText(e.target.value)
            }
            placeholder={instanceName}
          />
        </div>
      }
      footer={
        <div tw="flex justify-between items-center">
          <Button variant="textOnly" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            kind="functional"
            variant="error"
            size="md"
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            Reinstall
          </Button>
        </div>
      }
    />
  )
}
ReinstallModal.displayName = 'ReinstallModal'

export default memo(ReinstallModal)
