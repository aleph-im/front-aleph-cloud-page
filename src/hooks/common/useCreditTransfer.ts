import { useCallback, useState } from 'react'
import { useAppState } from '@/contexts/appState'
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client'

export type CreditTransferRecipient = {
  address: string
  amount: number
  expiration?: number
}

export type UseCreditTransferReturn = {
  transfer: (recipients: CreditTransferRecipient[]) => Promise<string>
  loading: boolean
  error?: Error
  lastItemHash?: string
}

const ALEPH_CREDIT_CHANNEL = 'ALEPH_CREDIT'
const ALEPH_CREDIT_TRANSFER_TYPE = 'aleph_credit_transfer'

export function useCreditTransfer(): UseCreditTransferReturn {
  const [state] = useAppState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()
  const [lastItemHash, setLastItemHash] = useState<string | undefined>()

  const transfer = useCallback(
    async (recipients: CreditTransferRecipient[]): Promise<string> => {
      const { account } = state.connection

      if (!account) {
        throw new Error('Account is required for credit transfers')
      }

      const sdkClient = new AuthenticatedAlephHttpClient(account)

      setLoading(true)
      setError(undefined)

      try {
        const credits = recipients.map((r) => ({
          address: r.address,
          amount: r.amount,
          ...(r.expiration && { expiration: r.expiration }),
        }))

        const res = await sdkClient.createPost({
          postType: ALEPH_CREDIT_TRANSFER_TYPE,
          channel: ALEPH_CREDIT_CHANNEL,
          content: {
            transfer: {
              credits,
            },
          },
        })

        const itemHash = res.item_hash
        setLastItemHash(itemHash)
        return itemHash
      } catch (err) {
        const error = err as Error
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [state.connection],
  )

  return {
    transfer,
    loading,
    error,
    lastItemHash,
  }
}
