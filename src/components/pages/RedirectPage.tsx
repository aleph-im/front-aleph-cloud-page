import { memo } from 'react'
import { TextGradient } from '@aleph-front/core'
import { useRedirect } from '@/hooks/common/useRedirect'
import { useRouter } from 'next/router'

export const RedirectPage = () => {
  const { pathname } = useRouter()

  useRedirect(pathname, pathname !== '/404')
  return (
    <div tw="w-full h-full flex pt-60 justify-center">
      <TextGradient type="h2">404 | NOT FOUND</TextGradient>
    </div>
  )
}

export default memo(RedirectPage)
