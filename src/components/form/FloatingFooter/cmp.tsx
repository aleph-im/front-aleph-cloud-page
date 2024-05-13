import { ReactNode, RefObject, useRef } from 'react'
import { createPortal } from 'react-dom'
import { StyledContainer } from './styles'
import {
  useBounds,
  useScroll,
  useTransition,
  useWindowSize,
} from '@aleph-front/core'
import { useTheme } from 'styled-components'

export type FloatingFooterProps = {
  children: ReactNode
  containerRef: RefObject<HTMLElement>
  shouldHide?: boolean
  offset?: number
  thresholdOffset?: number
  deps?: any[]
}

export const FloatingFooter = ({
  children,
  containerRef,
  offset = 0,
  thresholdOffset = offset,
  shouldHide = true,
  deps: depsProp = [],
}: FloatingFooterProps) => {
  const thresholdRef = useRef<HTMLDivElement>(null)

  const windowSize = useWindowSize()
  const { scrollY } = useScroll({
    ref: containerRef,
    debounceDelay: 0,
  })

  const deps = [windowSize, scrollY, ...depsProp]

  const { bounds: thresholdBounds } = useBounds({ ref: thresholdRef, deps })
  const { bounds: containerBounds } = useBounds({ ref: containerRef, deps })

  const thresholdBot = (thresholdBounds?.bottom || 0) + thresholdOffset
  const containerBot = containerBounds?.bottom || 0

  const sticked = thresholdBot > containerBot

  const theme = useTheme()

  const { shouldMount, stage } = useTransition(
    sticked,
    theme.transition.duration.fast,
  )

  const show = stage === 'enter'

  if (!containerBounds) return null

  const position = !shouldHide ? 'sticky' : 'fixed'
  const opacity = !shouldHide ? 1 : show ? 1 : 0
  const width = containerBounds?.width || 0
  const left = containerBounds?.left || 0
  const bottom =
    (windowSize?.height || 0) - (containerBounds?.bottom || 0) + offset

  const contentNode = (
    <StyledContainer
      $sticked={show}
      style={{ position, bottom, left, width, opacity }}
      as={'div'}
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
