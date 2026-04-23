import { LinkComponent } from '@aleph-front/core'

export type Voucher = {
  name: string
  image: string
  imageAlt: string
  amount: number
}

export type AccountInformationProps = {
  Link: LinkComponent
  accountAddress?: string
  accountAddressHref?: string
  balance?: number
  showCredits: boolean
  credits?: number | string
  rewards?: {
    amount: number
    days?: number
  }
  vouchers?: Voucher[]
  disabledTopUp?: boolean
  handleTopUpClick?: () => void
  showExternalUrl: boolean
  externalUrl?: {
    text: string
    url: string
  }
}
