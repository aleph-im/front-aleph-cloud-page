import { memo } from 'react'
import { useRedirect } from '@/hooks/common/useRedirect'
import { useRouter } from 'next/router'

export const RedirectPage = () => {
  const { pathname } = useRouter()

  useRedirect(pathname)
  return null
}

export default memo(RedirectPage)
