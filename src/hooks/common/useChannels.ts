import { useLocalRequest } from '@aleph-front/core'
import { apiServer } from '@/helpers/server'

type ChannelsResponse = {
  address: string
  channels: string[]
}

export function useChannels(address: string | undefined) {
  const {
    data: channels = [],
    loading: isLoading,
    error,
  } = useLocalRequest({
    doRequest: async () => {
      if (!address) return []

      const response = await fetch(
        `${apiServer}/api/v0/addresses/${address}/channels`,
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch channels: ${response.statusText}`)
      }

      const data: ChannelsResponse = await response.json()
      return data.channels || []
    },
    onSuccess: () => null,
    onError: () => null,
    flushData: true,
    triggerOnMount: true,
    triggerDeps: [address],
  })

  return { channels, isLoading, error }
}
