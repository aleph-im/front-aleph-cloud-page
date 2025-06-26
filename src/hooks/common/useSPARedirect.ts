import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { NAVIGATION_URLS } from '@/helpers/constants'

export function useSPARedirect(fallbackRedirect?: string): void {
  const router = useRouter()

  useEffect(() => {
    async function redirect() {
      if (router.asPath !== '/') {
        try {
          await router.replace(router.asPath, router.asPath)
        } catch (e) {
          await router.replace(
            NAVIGATION_URLS.error.notFound,
            NAVIGATION_URLS.error.notFound,
          )
        }
        return
      }

      if (!fallbackRedirect) return
      await router.replace(fallbackRedirect)
    }

    redirect()
  }, [fallbackRedirect, router])
}
