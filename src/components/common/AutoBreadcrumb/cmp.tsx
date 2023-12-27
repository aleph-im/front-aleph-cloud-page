import { memo, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Breadcrumb } from '@aleph-front/aleph-core'
import Link from 'next/link'
import { AutoBreacrumbProps } from './types'

export const AutoBreadcrumb = ({
  names = {},
  includeHome = true,
  ...rest
}: AutoBreacrumbProps) => {
  const router = useRouter()
  const isHome = router.pathname === '/'

  const uppercase = (s: string) => s.toUpperCase()

  const navLinks = useMemo(() => {
    if (isHome) return []

    const parts = router.pathname.split('/')
    const links = parts
      .map((item, index) => {
        const href = parts.slice(0, index + 1).join('/')
        let name = names[href] || names[item] || uppercase(item)
        name = typeof name === 'function' ? name(router) : name
        return { href, name }
      })
      .filter(({ name }) => name !== '' && name !== '-')
      .map(({ name, href }) => {
        return (
          <Link key={name} href={href}>
            {name}
          </Link>
        )
      })

    if (includeHome) {
      links.unshift(
        <Link key={'home'} href={'/'}>
          {(names['/'] as string) || 'HOME'}
        </Link>,
      )
    }

    return links
  }, [router, names, isHome, includeHome])

  return isHome ? null : <Breadcrumb navLinks={navLinks} {...rest} />
}
AutoBreadcrumb.displayName = 'AutoBreadcrumb'

export default memo(AutoBreadcrumb)
