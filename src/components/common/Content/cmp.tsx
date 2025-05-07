import { forwardRef, ForwardedRef, memo, useRef } from 'react'
import { StyledContent } from './styles'
import { ContentProps } from './types'
import useResetScroll from '@/hooks/common/useResetScroll'

export const Content = forwardRef(
  ({ children, ...props }: ContentProps, ref: ForwardedRef<HTMLDivElement>) => {
    // Create a local ref if none is provided through forwardRef
    const localRef = useRef<HTMLDivElement>(null)
    const contentRef = (ref || localRef) as React.RefObject<HTMLDivElement>

    // Use the custom hook to handle scroll reset
    useResetScroll([contentRef])

    return (
      <StyledContent ref={ref || localRef} {...props}>
        {children}
      </StyledContent>
    )
  },
)

Content.displayName = 'Content'

export default memo(Content) as typeof Content
