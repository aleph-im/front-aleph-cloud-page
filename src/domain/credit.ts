import { Account } from '@aleph-sdk/account'
import { ETHAccount } from '@aleph-sdk/ethereum'
import { v4 as uuidv4 } from 'uuid'
import BN from 'bn.js'
import { CheckoutStepType } from '@/helpers/constants'
import {
  TopUpCreditsFormData,
  PaymentCurrency,
  topUpCreditsSchema,
  PaymentChain,
  TokenEstimationRequest,
  TokenEstimationResponse,
  CreditEstimationRequest,
  CreditEstimationResponse,
} from '@/helpers/schemas/credit'
import { withRetry } from '@/helpers/utils'

// const ALEPH_CREDIT_API_URL = 'http://localhost:8080/api/v0'
const ALEPH_CREDIT_API_URL = 'https://credit.aleph.im/api/v0'
const ALEPH_CREDIT_PAYMENT_ENDPOINT = `${ALEPH_CREDIT_API_URL}/payment`
const ALEPH_CREDIT_TOKEN_TO_CREDIT_ENDPOINT = `${ALEPH_CREDIT_API_URL}/estimation/token-to-credit`
const ALEPH_CREDIT_CREDIT_TO_TOKEN_ENDPOINT = `${ALEPH_CREDIT_API_URL}/estimation/credit-to-token`
export const ALEPH_CREDIT_SENDER = '0x6aeaEEb08720DEc9d6dae1A8fc49344Dd99391Ac'

export enum PaymentStatus {
  Created = 'CREATED',
  Processing = 'PROCESSING',
  Cancelled = 'CANCELLED',
  Failed = 'FAILED',
  Transfered = 'TRANSFERED',
  Indexed = 'INDEXED',
  Broadcasted = 'BROADCASTED',
  Completed = 'COMPLETED',
}

export type PaymentRequest = {
  chain: PaymentChain
  id: string
  provider: 'WALLET'
  address: string
  currency: PaymentCurrency
  amount: number
  txHash?: string
}

export type PaymentResponse = {
  id: string
  config: {
    txHash: string
    rawTx: string
    tx: {
      nonce: number
      gasPrice: string
      gasLimit: string
      to: string
      value: string
      data: string
      chainId: number
      v: number
      r: string
      s: string
      type: null
      from: string
    }
  }
}

export type CreditPaymentHistoryItem = {
  id: string
  chain: string
  status: PaymentStatus
  createdAt: number
  updatedAt: number
  amount: number
  asset: string
  credits: number
  bonus: number
  price: number
  provider: string
  paymentMethod: string
  txHash?: string
  itemHash: string
}

export class CreditManager {
  constructor(private account: Account | undefined) {}

  static addSchema = topUpCreditsSchema

  // Payment functionality
  async getAddSteps(data: TopUpCreditsFormData): Promise<CheckoutStepType[]> {
    if (!this.account) {
      throw new Error('Account is required for credit payments')
    }

    if (!(this.account instanceof ETHAccount)) {
      throw new Error(
        'Only Ethereum accounts are supported for credit payments',
      )
    }

    if (data.currency === 'CARD') {
      throw new Error('Card payments are not available yet')
    }

    return ['creditTransaction']
  }

  async *addSteps(
    data: TopUpCreditsFormData,
  ): AsyncGenerator<void, string, unknown> {
    if (!this.account) {
      throw new Error('Account is required for credit payments')
    }

    if (!(this.account instanceof ETHAccount)) {
      throw new Error(
        'Only Ethereum accounts are supported for credit payments',
      )
    }

    const paymentId = uuidv4()

    const paymentResponse = await this.createPaymentRequest(data, paymentId)

    yield
    const txHash = await this.sendTransaction(paymentResponse.config.tx)

    await this.updateTransactionHash(data, paymentId, txHash)

    return txHash
  }

  private async upsertPaymentRequest(
    data: TopUpCreditsFormData,
    paymentId: string,
    txHash?: string,
  ): Promise<PaymentResponse | void> {
    if (!this.account) {
      throw new Error('Account is required for payment requests')
    }

    const paymentRequest: PaymentRequest = {
      id: paymentId,
      provider: data.provider,
      chain: data.chain,
      address: this.account.address,
      currency: data.currency,
      amount: data.amount,
      ...(txHash && { txHash }),
    }

    const fetchOperation = async () => {
      const response = await fetch(ALEPH_CREDIT_PAYMENT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      })

      if (!response.ok) {
        const error = await response.json().catch((e) => e)

        if (error.description) {
          throw new Error(`${error.description}`)
        }

        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    }

    // If updating with txHash, use retry logic
    if (txHash) {
      await withRetry(fetchOperation, {
        attempts: 5,
        delay: 1000,
      })
      return
    }

    // If creating (no txHash), return the response
    return fetchOperation()
  }

  private async createPaymentRequest(
    data: TopUpCreditsFormData,
    paymentId: string,
  ): Promise<PaymentResponse> {
    return this.upsertPaymentRequest(
      data,
      paymentId,
    ) as Promise<PaymentResponse>
  }

  private async sendTransaction(
    txData: PaymentResponse['config']['tx'],
  ): Promise<string> {
    try {
      const wallet = (this.account as any).wallet.provider.provider

      if (!wallet) {
        throw new Error('No wallet provider available')
      }

      const txHash = await wallet.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: txData.from,
            to: txData.to,
            gas: `0x${parseInt(txData.gasLimit).toString(16)}`,
            gasPrice: `0x${parseInt(txData.gasPrice).toString(16)}`,
            value: txData.value,
            data: txData.data,
          },
        ],
      })

      return txHash as string
    } catch (error) {
      throw new Error(
        `Transaction failed: ${(error as any)?.message || 'Unknown error'}`,
      )
    }
  }

  private async updateTransactionHash(
    data: TopUpCreditsFormData,
    paymentId: string,
    txHash: string,
  ): Promise<void> {
    await this.upsertPaymentRequest(data, paymentId, txHash)
  }

  // Token estimation functionality
  async getTokenToCreditsEstimation(
    data: TopUpCreditsFormData,
  ): Promise<TokenEstimationResponse> {
    const blockchain = data.chain
    const token = data.currency

    // Convert amount to 18-decimal precision string using BN
    const amount = new BN(data.amount.toString())
      .mul(new BN('1000000000000000000'))
      .toString()

    const estimationRequest: TokenEstimationRequest = {
      blockchain,
      token,
      amount,
    }

    try {
      const response = await fetch(ALEPH_CREDIT_TOKEN_TO_CREDIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(estimationRequest),
      })

      if (!response.ok) {
        const error = await response.json().catch((e) => e)

        if (error.description) {
          throw new Error(`${error.description}`)
        }

        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error fetching token estimation:', error)
      throw new Error('Failed to fetch token estimation')
    }
  }

  // Credit to token estimation functionality
  async getCreditToTokenEstimation(
    creditAmount: number,
    chain: PaymentChain,
    currency: PaymentCurrency,
  ): Promise<CreditEstimationResponse> {
    const estimationRequest: CreditEstimationRequest = {
      blockchain: chain,
      token: currency,
      creditAmount,
    }

    try {
      const response = await fetch(ALEPH_CREDIT_CREDIT_TO_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(estimationRequest),
      })

      if (!response.ok) {
        const error = await response.json().catch((e) => e)

        if (error.description) {
          throw new Error(`${error.description}`)
        }

        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Convert token amount from wei (18 decimals) to whole units, ceiling up
      const tokenAmountInWei = BigInt(data.tokenAmount)
      const divisor = BigInt(10 ** 18)
      const quotient = tokenAmountInWei / divisor
      const remainder = tokenAmountInWei % divisor
      // Ceil up: add 1 if there's any remainder
      const tokenAmountInUnits = Number(
        remainder > 0n ? quotient + 1n : quotient,
      )

      return {
        ...data,
        tokenAmountInUnits,
      }
    } catch (error) {
      console.error('Error fetching credit to token estimation:', error)
      throw new Error('Failed to fetch credit to token estimation')
    }
  }

  // Payment history functionality
  async getPaymentHistory(): Promise<CreditPaymentHistoryItem[]> {
    if (!this.account) {
      throw new Error('Account is required for payment history')
    }

    try {
      const response = await fetch(
        `${ALEPH_CREDIT_PAYMENT_ENDPOINT}?address=${this.account.address}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        const error = await response.json().catch((e) => e)

        if (error.description) {
          throw new Error(`${error.description}`)
        }

        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const payments = await response.json()

      console.log('payments', payments)

      return payments.map((payment: any) => ({
        id: payment.id,
        chain: payment.chain,
        status: payment.status,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
        amount: payment.in_amount,
        asset: payment.in_currency,
        credits: payment.prices.credit_amount,
        bonus: payment.prices.credit_bonus_amount,
        price: payment.prices.credit_price_aleph,
        provider: payment.provider_id,
        paymentMethod: payment.payment_method,
        txHash: payment.tx_hash,
        itemHash: payment.item_hash,
      }))
    } catch (error) {
      console.error('Error fetching credit payment history:', error)
      throw new Error('Failed to fetch payment history')
    }
  }
}
