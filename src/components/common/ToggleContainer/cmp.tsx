import {
  Switch,
  ToggleContainer as CoreToggleContainer,
  NoisyContainer,
} from '@aleph-front/core'
import { ToggleContainerProps } from './types'
import { ChangeEvent, memo, useCallback, useState } from 'react'

export const ToggleContainer = ({
  label,
  children,
  ...rest
}: ToggleContainerProps) => {
  const [open, setOpen] = useState(false)

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setOpen(event.target.checked),
    [setOpen],
  )

  return (
    <NoisyContainer {...rest}>
      <Switch
        label={label}
        onChange={handleChange}
        checked={open}
        className="tp-body3"
      />
      <CoreToggleContainer open={open} shouldUnmount>
        <div tw="pt-10 pb-6">{children}</div>
      </CoreToggleContainer>
    </NoisyContainer>
  )
}
ToggleContainer.displayName = 'ToggleContainer'

export default memo(ToggleContainer) as typeof ToggleContainer
