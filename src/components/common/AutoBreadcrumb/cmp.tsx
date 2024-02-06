import { memo, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Breadcrumb } from '@aleph-front/core'
import { AutoBreacrumbProps } from './types'

export const AutoBreadcrumb = ({ names = {}, ...rest }: AutoBreacrumbProps) => {
  const router = useRouter()

  const uppercase = (s: string) => s.toUpperCase()

  const navLinks = useMemo(() => {
    const parts = ['/', ...router.pathname.split('/')].filter((p) => !!p)

    return parts
      .map((item, index) => {
        const href = `/${parts.slice(1, index + 1).join('/')}`

        const name = names[href] || names[item] || uppercase(item)
        const node = typeof name === 'function' ? name(router) : name

        return { href, node }
      })
      .filter(({ node }) => !!node && node !== '-')
      .map(({ node, href }, i, all) => {
        return i < all.length - 1 ? (
          <Link key={href} href={href}>
            {node}
          </Link>
        ) : (
          node
        )
      })
  }, [router, names])

  return <Breadcrumb navLinks={navLinks} {...rest} />
}
AutoBreadcrumb.displayName = 'AutoBreadcrumb'

export default memo(AutoBreadcrumb) as typeof AutoBreadcrumb
