import { memo } from 'react'
import {
  Spinner,
  SpinnerProps,
  useTransitionedEnterExit,
} from '@aleph-front/aleph-core'
import { StyledSpinnerContainer } from './styles'
import { createPortal } from 'react-dom'

export type SpinnerOverlayProps = SpinnerProps & {
  show: boolean
  center?: boolean
  fullScreen?: boolean
}

export const SpinnerOverlay = ({
  show,
  center = false,
  fullScreen = false,
  ...rest
}: SpinnerOverlayProps) => {
  const { shouldMount, state, ref } = useTransitionedEnterExit<HTMLDivElement>({
    onOff: show,
  })

  const cmp = (
    <>
      {shouldMount && (
        <StyledSpinnerContainer
          ref={ref}
          $show={state === 'enter'}
          $center={center}
          $fullScreen={fullScreen}
        >
          <Spinner {...rest} />
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
