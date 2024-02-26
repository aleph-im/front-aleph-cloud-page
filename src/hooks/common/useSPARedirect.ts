import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useSPARedirect(fallbackRedirect?: string): void {
  const router = useRouter()

  useEffect(() => {
    async function redirect() {
      if (router.asPath !== '/') {
        try {
          await router.replace(router.asPath, router.asPath)
        } catch (e) {
          await router.replace('/404', '/404')
        }
        return
      }

      if (!fallbackRedirect) return
      await router.replace(fallbackRedirect)
    }

    redirect()
  }, [fallbackRedirect, router])
}
