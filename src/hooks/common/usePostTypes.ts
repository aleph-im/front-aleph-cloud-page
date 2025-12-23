import { useLocalRequest } from '@aleph-front/core'
import { apiServer } from '@/helpers/server'

type PostTypesResponse = {
  address: string
  post_types: string[]
}

export function usePostTypes(address: string | undefined) {
  const {
    data: postTypes = [],
    loading: isLoading,
    error,
  } = useLocalRequest({
    doRequest: async () => {
      if (!address) return []

      const response = await fetch(
        `${apiServer}/api/v0/addresses/${address}/post_types`,
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch post types: ${response.statusText}`)
      }

      const data: PostTypesResponse = await response.json()
      return data.post_types || []
    },
    onSuccess: () => null,
    onError: () => null,
    flushData: true,
    triggerOnMount: true,
    triggerDeps: [address],
  })

  return { postTypes, isLoading, error }
}
