export type UseCreditTransferModalReturn = {
  isOpen: boolean
  handleOpen: () => void
  handleClose: () => void
}

export type CreditTransferFormData = {
  recipients: {
    address: string
    amount: number
    expiration?: string
  }[]
}
