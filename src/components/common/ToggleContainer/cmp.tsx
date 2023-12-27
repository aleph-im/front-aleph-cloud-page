import {
  Switch,
  ToggleContainer as CoreToggleContainer,
} from '@aleph-front/aleph-core'
import NoisyContainer from '../NoisyContainer'
import { ToggleContainerProps } from './types'
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
      <CoreToggleContainer open={open}>
        <div tw="pt-10 pb-6">{children}</div>
      </CoreToggleContainer>
    </NoisyContainer>
  )
}
