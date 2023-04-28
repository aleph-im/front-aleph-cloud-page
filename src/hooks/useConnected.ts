import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppState } from '@/contexts/appState'

/**
 * Redirects to a route if the user is not connected
 *
 * @param route The path to redirect to (defaults to "/")
 */
export default function useConnected(route = '/') {
  const [state] = useAppState()
  const router = useRouter()

  useEffect(() => {
    if (!state.account) {
      router.replace(route)
    }
  })
}
