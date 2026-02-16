import { useEffect, useState } from 'react'
import { ProxyUrlData } from './types'

const PROXY_API_BASE = 'https://api.2n6.me'

export function useEntityProxyUrl(instanceHash?: string) {
  const [data, setData] = useState<ProxyUrlData | undefined>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!instanceHash) {
      setData(undefined)
      return
    }

    const fetchProxyUrl = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${PROXY_API_BASE}/api/hash/${instanceHash}`)
        if (!res.ok) {
          setData(undefined)
          return
        }
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error('Failed to fetch proxy URL:', e)
        setData(undefined)
      } finally {
        setLoading(false)
      }
    }

    fetchProxyUrl()
  }, [instanceHash])

  return { data, loading }
}
