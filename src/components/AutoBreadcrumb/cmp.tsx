import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Breadcrumb } from '@aleph-front/aleph-core'
import Link from 'next/link'
import { AutoBreacrumbProps } from './types'

export default function AutoBreadcrumb({ name }: AutoBreacrumbProps){
  const router = useRouter()
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const navLinks = useMemo(() => {
    return router
            .pathname
            .split('/')
            .filter(item => item !== '')
            .map((item, index, ar) => {
              if(index === ar.length - 1) {
                if(name) return <span>{name}</span>

                return <span key={item}>{capitalize(item)}</span>
              }
              const href = String('../').repeat(ar.length - (index + 1)) + item
              return (
                <Link key={item} href={href}>{capitalize(item)}</Link>
              )
            })
  }, [router.pathname, name])

  return <Breadcrumb navLinks={navLinks} />
}