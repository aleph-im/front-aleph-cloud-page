import { BreakpointId } from '@aleph-front/core'

export type FakeProgressBarProps = {
  loading: boolean
  breakpoint: BreakpointId
}

export type FakeProgressBarHookReturn = {
  loading: boolean
  breakpoint: BreakpointId
  progress: number
  skipTransition: boolean
  shouldMount: boolean
}
