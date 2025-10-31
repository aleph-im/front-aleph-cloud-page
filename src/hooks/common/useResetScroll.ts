import { useRouter } from 'next/router'
import { useEffect, RefObject, useRef } from 'react'

/**
 * Hook to reset scroll positions when navigating between pages
 * @param refs An array of refs to scrollable HTML elements
 * @param behavior The scroll behavior (default is 'smooth')
 */
export default function useResetScroll(
  refs: RefObject<HTMLElement>[] = [],
  behavior: ScrollBehavior = 'smooth',
) {
  const router = useRouter()
  const prevPathnameRef = useRef<string>()

  useEffect(() => {
    const resetScroll = () => {
      // Scroll configuration
      const scrollOptions = {
        top: 0,
        left: 0,
        behavior: behavior,
      }

      // Reset window scroll
      window.scrollTo(scrollOptions)

      // Reset document elements
      if (document.documentElement)
        document.documentElement.scrollTop = scrollOptions.top

      // Reset body scroll
      if (document.body) document.body.scrollTop = scrollOptions.top

      // Reset all provided refs
      refs.forEach((ref) => {
        if (ref?.current) {
          if (typeof ref.current.scrollTo === 'function') {
            ref.current.scrollTo(scrollOptions)
          } else {
            ref.current.scrollTop = scrollOptions.top
          }
        }
      })
    }

    const handleRouteChange = () => {
      // Only reset scroll if the pathname has changed (avoid scroll on query or hash changes)
      if (prevPathnameRef.current !== router.pathname) {
        resetScroll()
        prevPathnameRef.current = router.pathname
      }
    }

    // Set initial pathname and reset scroll on mount
    if (prevPathnameRef.current === undefined) {
      prevPathnameRef.current = router.pathname
      resetScroll()
    }

    // Listen for route changes
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router, refs, behavior])
}
