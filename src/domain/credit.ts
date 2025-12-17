import { Account } from '@aleph-sdk/account'
import { ETHAccount } from '@aleph-sdk/ethereum'
import { v4 as uuidv4 } from 'uuid'
import { CheckoutStepType } from '@/helpers/constants'
import {
  TopUpCreditsFormData,
  PaymentCurrency,
  topUpCreditsSchema,
  PaymentChain,
} from '@/helpers/schemas/credit'
import { getDate, withRetry } from '@/helpers/utils'

const ALEPH_CREDIT_API_URL = 'http://localhost:8080/api/v0'
// const ALEPH_CREDIT_API_URL = 'https://credit.aleph.im/api/v0'
const ALEPH_CREDIT_PAYMENT_ENDPOINT = `${ALEPH_CREDIT_API_URL}/payment`

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
  status: PaymentStatus
  date: string
  amount: number
  asset: string
  credits: number
  txHash?: string
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

  private async createPaymentRequest(
    data: TopUpCreditsFormData,
    paymentId: string,
  ): Promise<PaymentResponse> {
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
    }

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

  private async sendTransaction(
    txData: PaymentResponse['config']['tx'],
  ): Promise<string> {
    try {
      const wallet = (this.account as any).wallet.provider.provider

      if (!wallet) {
        throw new Error('No wallet provider available')
      }

      console.log(txData, {
        from: txData.from,
        to: txData.to,
        gas: `0x${parseInt(txData.gasLimit).toString(16)}`,
        gasPrice: `0x${parseInt(txData.gasPrice).toString(16)}`,
        value: txData.value,
        data: txData.data,
      })

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
    if (!this.account) {
      throw new Error('Account is required for payment requests')
    }

    const updateRequest: PaymentRequest = {
      id: paymentId,
      provider: data.provider,
      chain: data.chain,
      address: this.account.address,
      currency: data.currency,
      amount: data.amount,
      txHash,
    }

    await withRetry(
      async () => {
        const updateResponse = await fetch(ALEPH_CREDIT_PAYMENT_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateRequest),
        })

        if (!updateResponse.ok) {
          let errorMsg = 'Failed to update transaction hash in backend'

          const error = await updateResponse.json().catch((e) => e)

          if (error.description) {
            errorMsg = error.description
          }

          throw new Error(errorMsg)
        }
      },
      {
        attempts: 5,
        delay: 1000,
      },
    )
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

      return payments.map((payment: any) => ({
        id: payment.id,
        status: payment.status,
        date: getDate(payment.created_at / 1000),
        amount: payment.in_amount,
        asset: payment.in_currency,
        credits: payment.out_amount || 0,
        txHash: payment.tx_hash,
      }))
    } catch (error) {
      console.error('Error fetching credit payment history:', error)
      throw new Error('Failed to fetch payment history')
    }
  }
}
