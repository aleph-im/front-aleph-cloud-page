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

  useEffect(() => {
    let openIt: any
    let closeIt: any

    function getHeights() {
      const divHeight = ref?.current?.getBoundingClientRect()?.height || 0
      const wrapHeight = wrapRef?.current?.getBoundingClientRect()?.height || 0

      return [divHeight, wrapHeight]
    }

    async function openInterval() {
      const [divHeight, wrapHeight] = getHeights()
      if (wrapHeight < divHeight) return

      setHeight('auto')
      openIt && clearInterval(openIt)
    }

    async function closeInterval() {
      const [divHeight, wrapHeight] = getHeights()
      if (wrapHeight < divHeight) return

      setHeight('0')
      closeIt && clearInterval(closeIt)
    }

    const [divHeight] = getHeights()

    if (open) {
      setHeight(`${divHeight}px`)
      openIt = setInterval(openInterval, 700)
    } else {
      setHeight(`${divHeight}px`)
      closeIt = setInterval(closeInterval, 0)
    }

    return () => {
      openIt && clearInterval(openIt)
      closeIt && clearInterval(closeIt)
    }
  }, [open])

  return (
    <NoisyContainer {...rest}>
      <Switch label={label} onChange={handleChange} checked={open} />
      <StyledToggleContainer $height={height} ref={wrapRef}>
        <div tw="mt-4 py-6" ref={ref}>
          {children}
        </div>
      </StyledToggleContainer>
    </NoisyContainer>
  )
}
