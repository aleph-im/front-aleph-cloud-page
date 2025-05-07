import FakeProgressBar from '@/components/common/FakeProgressBar'
import { useRouterLoadState } from '@/hooks/common/useRouterLoadState'
import { BreakpointId } from '@aleph-front/core'
import { memo } from 'react'

export function LoadingProgress({ breakpoint }: { breakpoint: BreakpointId }) {
  const { loading } = useRouterLoadState()

  return <FakeProgressBar breakpoint={breakpoint} loading={loading} />
}
LoadingProgress.displayName = 'LoadingProgress'

export default memo(LoadingProgress)
