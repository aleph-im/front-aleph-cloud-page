import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export type UseRouterLoadStateReturn = { loading: boolean }

export function useRouterLoadState(): UseRouterLoadStateReturn {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    function handleRouteStart() {
      setLoading(true)
    }

    function handleRouteEnd() {
      setLoading(false)
    }

    router.events.on('routeChangeStart', handleRouteStart)
    router.events.on('routeChangeComplete', handleRouteEnd)
    router.events.on('routeChangeError', handleRouteEnd)
    setLoading(false)

    return () => {
      router.events.off('routeChangeStart', handleRouteStart)
      router.events.off('routeChangeComplete', handleRouteEnd)
      router.events.off('routeChangeError', handleRouteEnd)
    }
  }, [router])

  return { loading }
}
