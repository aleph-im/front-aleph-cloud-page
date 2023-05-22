import { useRouter } from 'next/router'
import { RefObject, useCallback, useRef } from 'react'

function getHandleScroll(
  ref: RefObject<HTMLElement>,
  router: ReturnType<typeof useRouter>,
) {
  if (!ref.current) return
  if (ref.current.id) {
    router.push({ hash: ref.current.id }, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  // @note: Fix for sticky header (works better than scroll-margin-top + scrollIntoView)
  const { top } = ref.current.getBoundingClientRect()
  window.scrollTo({ behavior: 'smooth', top: window.scrollY + top - 100 })
}

export type UseScrollToReturn = [RefObject<HTMLElement>, () => void]

export function useScrollTo(_ref?: RefObject<HTMLElement>): UseScrollToReturn {
  const innerRef = useRef(null)
  const ref = _ref || innerRef
  const router = useRouter()

  const handleScroll = useCallback(
    () => getHandleScroll(ref, router),
    [ref.current],
  )

  return [ref, handleScroll]
}
