import { Switch } from '@aleph-front/aleph-core'
import NoisyContainer from '../NoisyContainer'
import { ToggleContainerProps } from './types'
import { StyledToggleContainer } from './styles'
import { ChangeEvent, useCallback, useState } from 'react'

export default function ToggleContainer({
  label,
  children,
  ...rest
}: ToggleContainerProps) {
  const [open, setOpen] = useState(false)

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setOpen(event.target.checked),
    [setOpen],
  )

  return (
    <NoisyContainer {...rest}>
      <Switch label={label} onChange={handleChange} checked={open} />
      <StyledToggleContainer $open={open}>
        <div tw="mt-4 py-6">{children}</div>
      </StyledToggleContainer>
    </NoisyContainer>
  )
}
