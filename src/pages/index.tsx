import { useSPARedirect } from '@/hooks/common/useSPARedirect'
import { memo } from 'react'

export function HomePage() {
  useSPARedirect('/console')
  return null
}

export default memo(HomePage)
