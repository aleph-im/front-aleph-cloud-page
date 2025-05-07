import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useTransition } from '@aleph-front/core'
import { FakeProgressBarHookReturn, FakeProgressBarProps } from './types'

export const useFakeProgressBar = ({
  loading,
  breakpoint,
}: FakeProgressBarProps): FakeProgressBarHookReturn => {
  const [progress, setProgress] = useState(0)
  const [skipTransition, setSkipTransition] = useState(false)
  const transitionDuration = 500
  const { shouldMount, stage } = useTransition(loading, transitionDuration)
  const loadingRef = useRef(loading)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Reset progress when a new page starts loading
  useEffect(() => {
    if (loading && !loadingRef.current) {
      // Immediate reset without animation when starting a new load
      setSkipTransition(true)
      setProgress(0)

      // Re-enable transitions in next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSkipTransition(false)
          setProgress(15) // Start from 15% with animation enabled
        })
      })
    }

    // Update ref
    loadingRef.current = loading
  }, [loading])

  // Handle progress animation
  useLayoutEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (loading) {
      // Only set up interval if we're not skipping transitions
      if (!skipTransition) {
        intervalRef.current = setInterval(() => {
          setProgress((prevProgress) => {
            // Start from at least 15%
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
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            return 95
          })
        }, 100)
      }
    } else if (shouldMount && stage === 'leave') {
      // Complete progress when route change is done
      setProgress(100)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [loading, skipTransition, shouldMount, stage])

  // Reset progress after completion
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setProgress(0)
      }, transitionDuration)

      return () => clearTimeout(timeout)
    }
  }, [progress])

  return {
    loading,
    breakpoint,
    progress,
    skipTransition,
    shouldMount,
  }
}
