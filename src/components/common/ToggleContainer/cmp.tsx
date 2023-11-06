import { Switch } from '@aleph-front/aleph-core'
import NoisyContainer from '../NoisyContainer'
import { ToggleContainerProps } from './types'
import { StyledToggleContainer } from './styles'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'

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

  const wrapRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  const [height, setHeight] = useState(open ? 'auto' : '0')

  function getHeights() {
    const divHeight = ref?.current?.getBoundingClientRect()?.height || 0
    const wrapHeight = wrapRef?.current?.getBoundingClientRect()?.height || 0

    return [divHeight, wrapHeight]
  }

  useEffect(() => {
    let frame: number

    function clear() {
      frame && cancelAnimationFrame(frame)
      wrapRef?.current?.removeEventListener('transitionend', openFn)
    }

    async function openFn() {
      setHeight('auto')
    }

    async function closeFn() {
      setHeight('0')
    }

    const [divHeight, wrapHeight] = getHeights()

    clear()

    if (open) {
      setHeight(() => {
        wrapRef?.current?.addEventListener('transitionend', openFn)
        return `${divHeight}px`
      })
    } else {
      setHeight(() => {
        frame = requestAnimationFrame(closeFn)
        return `${wrapHeight}px`
      })
    }

    return clear
  }, [open])
  return (
    <NoisyContainer {...rest}>
      <Switch label={label} onChange={handleChange} checked={open} />
      <StyledToggleContainer $height={height} ref={wrapRef}>
        <div tw="pt-10 pb-6" ref={ref}>
          {children}
        </div>
      </StyledToggleContainer>
    </NoisyContainer>
  )
}
