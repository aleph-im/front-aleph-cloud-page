import { useState, useEffect } from 'react'
import { AlephHttpClient } from '@aleph-sdk/client'
import { apiServer } from '@/helpers/server'

export function useAggregateKeys(address: string | undefined) {
  const [aggregateKeys, setAggregateKeys] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // const [appState] = useAppState()

  // const {manager: } = appState

  useEffect(() => {
    if (!address) {
      setAggregateKeys([])
      return
    }

    const fetchAggregateKeys = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const sdkClient = new AlephHttpClient(apiServer)
        const response: Record<string, unknown> =
          await sdkClient.fetchAggregates(address)

        const keys = Object.keys(response).filter((key) => key !== '')
        setAggregateKeys(keys.sort())
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setAggregateKeys([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAggregateKeys()
  }, [address])

  return { aggregateKeys, isLoading, error }
}
