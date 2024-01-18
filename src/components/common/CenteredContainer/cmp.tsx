import { memo } from 'react'
import { CenteredContainerProps } from './types'

export const CenteredContainer = ({
  children,
  variant = 'default',
}: CenteredContainerProps) => {
  return (
    <>
      {variant === 'default' ? (
        <div tw="max-w-[715px] mx-auto">{children}</div>
      ) : (
        <div tw="max-w-[961px] mx-auto">{children}</div>
      )}
    </>
  )
}
CenteredContainer.displayName = 'CenteredContainer'

export default memo(CenteredContainer) as typeof CenteredContainer
