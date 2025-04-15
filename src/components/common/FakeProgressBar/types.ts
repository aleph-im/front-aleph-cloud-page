export type FakeProgressBarProps = {
  loading: boolean
}

export type FakeProgressBarHookReturn = {
  loading: boolean
  progress: number
  skipTransition: boolean
  shouldMount: boolean
}
