import { z } from 'zod'

export const paymentCurrencySchema = z.enum(['ALEPH', 'USDC', 'CARD'], {
  errorMap: () => ({ message: 'Please select a valid payment method' }),
})

export const paymentChainSchema = z.enum(['ethereum', 'ethereum-sepolia'])

export const paymentProviderSchema = z.enum(['WALLET'])

export const topUpCreditsSchema = z.object({
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be greater than 0')
    .min(100, 'Amount cannot be less than 100')
    .max(100000, 'Amount cannot exceed 100,000'),
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
