import { ReactNode, RefObject, useRef } from 'react'
import { createPortal } from 'react-dom'
import { StyledContainer } from './styles'
import {
  useBounds,
  useScroll,
  useTransitionedEnterExit,
  useWindowSize,
} from '@aleph-front/core'

export type FloatingFooterProps = {
  children: ReactNode
  containerRef: RefObject<HTMLElement>
  shouldHide?: boolean
  offset?: number
  thresholdOffset?: number
}

export const FloatingFooter = ({
  children,
  containerRef,
  offset = 0,
  thresholdOffset = offset,
  shouldHide = true,
}: FloatingFooterProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const thresholdRef = useRef<HTMLDivElement>(null)

  const windowSize = useWindowSize()
  const { scrollY } = useScroll({
    ref: containerRef,
    debounceDelay: shouldHide ? 0 : Number.MAX_SAFE_INTEGER,
  })

  const deps = [windowSize, scrollY]

  const { bounds: thresholdBounds } = useBounds({ ref: thresholdRef, deps })
  const { bounds: containerBounds } = useBounds({ ref: containerRef, deps })

  const thresholdBot = (thresholdBounds?.bottom || 0) + thresholdOffset
  const containerBot = containerBounds?.bottom || 0

  const sticked = thresholdBot > containerBot

  const { shouldMount, state } = useTransitionedEnterExit({
    onOff: shouldHide && sticked,
    ref: contentRef,
  })

  const show = state === 'enter'

  const position = !shouldHide ? 'sticky' : 'fixed'
  const opacity = !shouldHide ? 1 : show ? 1 : 0
  const width = containerBounds?.width || 0
  const left = containerBounds?.left || 0
  const bottom =
    (windowSize?.height || 0) - (containerBounds?.bottom || 0) + offset

  const contentNode = (
    <StyledContainer
      ref={contentRef}
      style={{ position, bottom, left, width, opacity }}
    >
      {children}
    </StyledContainer>
  )

  return (
    <>
      {shouldHide
        ? shouldMount &&
          typeof window === 'object' &&
          createPortal(contentNode, window.document.body)
        : contentNode}

      <div ref={thresholdRef} />
    </>
  )
}

export default FloatingFooter
