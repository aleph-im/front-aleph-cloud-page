import {
  Switch,
  ToggleContainer as CoreToggleContainer,
  NoisyContainer,
} from '@aleph-front/core'
import { SwitchToggleContainerProps } from './types'
import { ChangeEvent, memo, useCallback, useState } from 'react'
import { StyledIcon } from './styles'

export const ToggleContainer = ({
  label,
  children,
  ...rest
}: SwitchToggleContainerProps) => {
  const [active, setActive] = useState(false)
  const [open, setOpen] = useState(false)

  const handleChangeActive = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const active = event.target.checked

      setActive(active)
      setOpen(active)
    },
    [setActive, setOpen],
  )

  const handleClickOpen = useCallback(() => setOpen((prev) => !prev), [setOpen])

  return (
    <NoisyContainer {...rest}>
      <div tw="flex justify-between items-center">
        <Switch
          label={label}
          onChange={handleChangeActive}
          checked={active}
          className={'tp-body3 ' + (active ? ' text-main0' : '')}
        />
        <StyledIcon
          {...{
            $isOpen: open,
            $isVisible: active,
            onClick: handleClickOpen,
          }}
        />
      </div>
      <CoreToggleContainer open={open} shouldUnmount={!active}>
        <div tw="pt-10 pb-6">{children}</div>
      </CoreToggleContainer>
    </NoisyContainer>
  )
}
ToggleContainer.displayName = 'ToggleContainer'

export default memo(ToggleContainer) as typeof ToggleContainer
