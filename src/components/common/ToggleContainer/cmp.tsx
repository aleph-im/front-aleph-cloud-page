import { Switch, useBounds } from '@aleph-front/aleph-core'
import NoisyContainer from '../NoisyContainer'
import { ToggleContainerProps } from './types'
import { StyledToggleContainer } from './styles'
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react'

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

  const ref = useRef<HTMLDivElement>(null)
  const [bounds] = useBounds(undefined, ref, [ref])

  const $height = useMemo(
    () => `${open ? bounds?.height || 0 : 0}px`,
    [bounds?.height, open],
  )

  return (
    <NoisyContainer {...rest}>
      <Switch label={label} onChange={handleChange} checked={open} />
      <StyledToggleContainer $height={$height}>
        <div tw="mt-4 py-6" ref={ref}>
          {children}
        </div>
      </StyledToggleContainer>
    </NoisyContainer>
  )
}
