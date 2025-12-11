import { useState, useEffect } from 'react'
import { apiServer } from '@/helpers/server'

type PostTypesResponse = {
  address: string
  post_types: string[]
}

export function usePostTypes(address: string | undefined) {
  const [postTypes, setPostTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!address) {
      setPostTypes([])
      return
    }

    const fetchPostTypes = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `${apiServer}/api/v0/addresses/${address}/post_types`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch post types: ${response.statusText}`)
        }

        const data: PostTypesResponse = await response.json()
        setPostTypes(data.post_types || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setPostTypes([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPostTypes()
  }, [address])

  return { postTypes, isLoading, error }
}
