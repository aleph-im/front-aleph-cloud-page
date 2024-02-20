import { memo } from 'react'
import { SpinnerProps, useTransitionedEnterExit } from '@aleph-front/core'
import { StyledSpinnerContainer } from './styles'
import { createPortal } from 'react-dom'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'

export type SpinnerOverlayProps = SpinnerProps & {
  show: boolean
  center?: boolean
  fullScreen?: boolean
}

export const SpinnerOverlay = ({
  show,
  center = false,
  fullScreen = false,
  color = 'main0',
  ...rest
}: SpinnerOverlayProps) => {
  const { shouldMount, state, ref } = useTransitionedEnterExit<HTMLDivElement>({
    onOff: show,
  })

  const theme = useTheme()
  color = theme.color[color] || color

  const cmp = (
    <>
      {shouldMount && (
        <StyledSpinnerContainer
          ref={ref}
          $show={state === 'enter'}
          $center={center}
          $fullScreen={fullScreen}
        >
          {/* <Spinner {...{ color, ...rest }} /> */}
          <RotatingLines strokeColor={color} width="10em" {...rest} />
        </StyledSpinnerContainer>
      )}
    </>
  )

  return (
    <>
      {fullScreen && typeof document === 'object'
        ? createPortal(cmp, document.body)
        : cmp}
    </>
  )
}
SpinnerOverlay.displayName = 'SpinnerOverlay'

export default memo(SpinnerOverlay)