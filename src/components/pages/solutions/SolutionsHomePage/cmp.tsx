import { memo } from 'react'
import { useRedirect } from '@/hooks/common/useRedirect'

export const SolutionsHomePage = () => {
  useRedirect('/solutions/dashboard')
  return null
}

export default memo(SolutionsHomePage)
