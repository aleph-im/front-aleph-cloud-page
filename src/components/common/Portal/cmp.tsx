import { memo, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { PortalProps } from './types'

export const Portal = ({ children, containerRef }: PortalProps) => {
  const [SSR, setSSR] = useState(true)
  const container = containerRef?.current

  const shouldRender = container || !SSR

  useEffect(() => {
    if (container) return
    setSSR(false)
  }, [container])

  return shouldRender
    ? createPortal(children, container || window.document.body)
    : null
}
Portal.displayName = 'Portal'

export default memo(Portal) as typeof Portal
