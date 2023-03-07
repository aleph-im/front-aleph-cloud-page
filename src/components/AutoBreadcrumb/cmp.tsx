import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Breadcrumb } from '@aleph-front/aleph-core'
import Link from 'next/link'

export default function AutoBreadcrumb(){
  const router = useRouter()

  const navLinks = useMemo(() => {
    return router
            .pathname
            .split('/')
            .filter(item => item !== '')
            .map((item, index, ar) => {
              const href = String('../').repeat(ar.length - (index + 1)) + item
              return (
              <Link href={href}>{item.charAt(0).toUpperCase() + item.slice(1)}</Link>
            )})
  }, [router.pathname])

  return <Breadcrumb navLinks={navLinks} />
}