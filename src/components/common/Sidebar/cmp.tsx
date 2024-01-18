import { AnchorHTMLAttributes, ReactNode, memo, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IconName, LinkComponent, RouterSidebar } from '@aleph-front/core'
import { useUserStoreAllowance } from '@/hooks/common/useUserStoreAllowance'
import { useRoutes } from '@/hooks/common/useRoutes'

export type SidebarLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  icon?: IconName
  flag?: number
  isOpen?: boolean
  children?: ReactNode
}

const Sidebar = memo(() => {
  const { routes } = useRoutes()
  const { pathname } = useRouter()
  const [open] = useState<boolean>()

  // --------------------------------------------

  // @todo: fix types in core and install new version
  const allowanceInfo: any = useUserStoreAllowance()
  const breakpoint = 'lg'

  return (
    <RouterSidebar
      {...{
        breakpoint,
        routes,
        pathname,
        Link: Link as LinkComponent,
        allowanceInfo,
        open,
        onToggle: undefined,
      }}
    />
  )
})
Sidebar.displayName = 'Sidebar'

export default Sidebar
