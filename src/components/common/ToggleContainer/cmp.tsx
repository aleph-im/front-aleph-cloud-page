import {
  Switch,
  ToggleContainer as CoreToggleContainer,
  NoisyContainer,
} from '@aleph-front/core'
import { ToggleContainerProps } from './types'
import { ChangeEvent, memo, useCallback, useState } from 'react'
import { StyledIcon } from './styles'

export const ToggleContainer = ({
  label,
  withSwitch = true,
  toggleAlwaysVisible = false,
  children,
  ...rest
}: ToggleContainerProps) => {
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
        {withSwitch ? (
          <Switch
            label={label as string}
            onChange={handleChangeActive}
            checked={active}
            className={'tp-body3 ' + (active ? ' text-main0' : '')}
          />
        ) : (
          label
        )}
        <StyledIcon
          {...{
            $isOpen: open,
            $isVisible: active || toggleAlwaysVisible,
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
