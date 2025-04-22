import FakeProgressBar from '@/components/common/FakeProgressBar'
import { useRouterLoadState } from '@/hooks/common/useRouterLoadState'
import { memo } from 'react'

export function Loading() {
  const { loading } = useRouterLoadState()

  return <FakeProgressBar loading={loading} />
}
Loading.displayName = 'Loading'

export default memo(Loading)
