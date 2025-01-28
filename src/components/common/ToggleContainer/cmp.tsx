import { ToggleContainer as CoreToggleContainer } from '@aleph-front/core'
import { ToggleContainerProps } from './types'
import { memo, useCallback, useState } from 'react'
import { StyledIcon, StyledToggleBar, StyledToggleContainer } from './styles'

export const ToggleContainer = ({
  toggleTitle,
  backgroundColor = 'fx-grain-2',
  children,
}: ToggleContainerProps) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = useCallback(() => setOpen((prev) => !prev), [setOpen])

  return (
    <StyledToggleContainer $backgroundColor={backgroundColor}>
      <StyledToggleBar onClick={handleClickOpen}>
        {toggleTitle}
        <StyledIcon $isOpen={open} />
      </StyledToggleBar>
      <CoreToggleContainer open={open} shouldUnmount={!open}>
        <div tw="pt-10 p-6">{children}</div>
      </CoreToggleContainer>
    </StyledToggleContainer>
  )
}
ToggleContainer.displayName = 'ToggleContainer'

export default memo(ToggleContainer) as typeof ToggleContainer
