import { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useTransition } from '@aleph-front/core'
import { StyledProgressContainer, StyledFakeProgressBar } from './styles'

export type FakeProgressBarProps = {
  loading: boolean
}

export const FakeProgressBar = ({ loading }: FakeProgressBarProps) => {
  const [progress, setProgress] = useState(15)
  const transitionDuration = 500
  const { shouldMount, stage } = useTransition(loading, transitionDuration)

  const resetProgress = useCallback(() => {
    setProgress(0)
  }, [])

  useLayoutEffect(() => {
    let interval: NodeJS.Timeout

    if (loading) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          // Slower at beginning, faster at end
          if (prevProgress < 15) {
            return 15
          } else if (prevProgress < 33) {
            // Medium start (0-33%)
            return prevProgress + 3.0
          } else if (prevProgress < 66) {
            // Very slow (33-66%)
            return prevProgress + 2.0
          } else if (prevProgress < 80) {
            // Slow (66-80%)
            return prevProgress + 1.0
          } else if (prevProgress < 90) {
            // Fast at end (80-90%)
            return prevProgress + 4.0
          } else if (prevProgress < 95) {
            // Super slow at end (90-95%)
            return prevProgress + 0.5
          }

          // Stop at 95%
          clearInterval(interval)
          return 95
        })
      }, 100)

      return () => {
        clearInterval(interval)
      }
    } else if (shouldMount && stage === 'leave') {
      // Complete progress when route change is done
      setProgress(100)
    }

    return () => {
      clearInterval(interval)
    }
  }, [loading, resetProgress, shouldMount, stage])

  // Reset progress after completion
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        if (progress >= 100) resetProgress()
      }, transitionDuration)

      return () => clearTimeout(timeout)
    }
  }, [progress, resetProgress])

  // if (shouldMount || loading) {
  //   console.log('ahora')
  // } else {
  //   console.log('no ahora')
  // }
  // console.log('loading', loading)
  // console.log('shouldMount', shouldMount)
  // console.log('stage', stage)

  return (
    <StyledProgressContainer $show={shouldMount || loading}>
      <StyledFakeProgressBar $progress={progress} />
    </StyledProgressContainer>
  )
}

FakeProgressBar.displayName = 'FakeProgressBar'

export default memo(FakeProgressBar)
