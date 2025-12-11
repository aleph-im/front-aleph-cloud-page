import { useState, useEffect } from 'react'
import { apiServer } from '@/helpers/server'

type ChannelsResponse = {
  address: string
  channels: string[]
}

export function useChannels(address: string | undefined) {
  const [channels, setChannels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!address) {
      setChannels([])
      return
    }

    const fetchChannels = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `${apiServer}/api/v0/addresses/${address}/channels`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch channels: ${response.statusText}`)
        }

        const data: ChannelsResponse = await response.json()
        setChannels(data.channels || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setChannels([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchChannels()
  }, [address])

  return { channels, isLoading, error }
}
