import { useEffect, useState } from 'react'

export type UseCreditToTokenReturn = {
  tokenAmount: number | null
  isLoading: boolean
  error: Error | null
}

export type CreditToTokenResponse = {
  creditAmount: number
  tokenAmount: string
  tokenSymbol: string
  priceRatio: number
  timestamp: number
}

const CREDIT_API_URL =
  'https://credit.aleph.im/api/v0/estimation/credit-to-token'

export const useCreditToToken = (
  creditAmount: number | undefined,
  blockchain = 'ethereum',
  token = 'USDC',
): UseCreditToTokenReturn => {
  const [tokenAmount, setTokenAmount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!creditAmount || creditAmount <= 0) {
      setTokenAmount(null)
      return
    }

    const fetchConversion = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(CREDIT_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blockchain,
            token,
            creditAmount,
          }),
        })

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data: CreditToTokenResponse = await response.json()

        // Convert tokenAmount from string (wei) to a readable number (USDC has 6 decimals)
        const amount = parseFloat(data.tokenAmount) / 1e6
        setTokenAmount(amount)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setTokenAmount(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversion()
  }, [creditAmount, blockchain, token])

  return { tokenAmount, isLoading, error }
}
