import { z } from 'zod'

export const paymentCurrencySchema = z.enum(['ALEPH', 'ETH', 'USDC', 'CARD'], {
  errorMap: () => ({ message: 'Please select a valid payment method' }),
})

export const paymentChainSchema = z.enum(['ethereum', 'ethereum-sepolia'])

export const paymentProviderSchema = z.enum(['WALLET'])

export const topUpCreditsSchema = z.object({
  amount: z.preprocess(
    (val) => (val === undefined || val === '' ? 0 : val),
    z.coerce
      .number({
        required_error: 'Amount is required',
        invalid_type_error: 'Amount must be a number',
      })
      .min(0, 'Amount must be greater than 0')
      .max(100000, 'Amount cannot exceed 100,000'),
  ),
  chain: paymentChainSchema,
  provider: paymentProviderSchema,
  currency: paymentCurrencySchema,
})

export type TopUpCreditsFormData = z.infer<typeof topUpCreditsSchema>
export type PaymentChain = z.infer<typeof paymentChainSchema>
export type PaymentProvider = z.infer<typeof paymentProviderSchema>
export type PaymentCurrency = z.infer<typeof paymentCurrencySchema>

export type TokenEstimationRequest = {
  blockchain: string
  token: string
  amount: string
}

export type TokenEstimationResponse = {
  tokenAmount: string
  tokenSymbol: string
  creditAmount: number
  creditBonusAmount: number
  totalPrice: number
  price: number
  bonusRatio: number
  timestamp: number
}

export type CreditEstimationRequest = {
  blockchain: string
  token: string
  creditAmount: number
}

// Credit transfer schema
export const creditTransferRecipientSchema = z.object({
  address: z
    .string()
    .min(1, 'Address is required')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be greater than $0'),
  expiration: z.string().optional(),
})

export const creditTransferSchema = z
  .object({
    recipients: z
      .array(creditTransferRecipientSchema)
      .min(1, 'At least one recipient is required'),
  })
  .refine(
    (data) => {
      const addresses = data.recipients
        .map((r) => r.address.toLowerCase())
        .filter(Boolean)
      return new Set(addresses).size === addresses.length
    },
    {
      message:
        'Duplicate recipient addresses are not allowed in a single transfer',
      path: ['recipients'],
    },
  )

export type CreditTransferFormData = z.infer<typeof creditTransferSchema>
export type CreditTransferRecipient = z.infer<
  typeof creditTransferRecipientSchema
>

export type CreditEstimationResponse = {
  tokenAmount: string
  tokenAmountInUnits: number // Token amount converted from wei to whole units
  tokenSymbol: string
  creditAmount: number
  creditBonusAmount: number
  price: number
  bonusRatio: number
  timestamp: number
}
