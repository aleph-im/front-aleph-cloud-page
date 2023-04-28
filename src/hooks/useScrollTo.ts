import { RefObject, useCallback, useRef } from 'react'

function getHandleScroll(ref: RefObject<HTMLElement>) {
  if (!ref.current) return

  // @note: Fix for sticky header (works better than scroll-margin-top + scrollIntoView)
  const { top } = ref.current.getBoundingClientRect()
  window.scrollTo({ behavior: 'smooth', top: window.scrollY + top - 100 })
}

export type UseScrollToReturn = [RefObject<HTMLElement>, () => void]

export function useScrollTo(_ref?: RefObject<HTMLElement>): UseScrollToReturn {
  const innerRef = useRef(null)
  const ref = _ref || innerRef

  const handleScroll = useCallback(() => getHandleScroll(ref), [ref.current])

  return [ref, handleScroll]
}
