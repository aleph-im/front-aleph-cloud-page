import { AnchorHTMLAttributes, ReactNode, memo, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IconName, LinkComponent, RouterSidebar } from '@aleph-front/core'
import { useUserStoreAllowance } from '@/hooks/common/useUserStoreAllowance'
import { useRoutes } from '@/hooks/common/useRoutes'
import { websiteUrl } from '@/helpers/constants'

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

  // Hack to extend the sidebar inner list
  /* useEffect(() => {
    document
      ?.querySelectorAll('[class^="styles__StyledNav2-"]')?.[0]
      ?.querySelectorAll('[class^="cmp___StyledDiv3-"]')?.[0]
      ?.setAttribute('style', 'padding-top: 2rem; height: auto;')
  }, []) */
  return (
    <RouterSidebar
      {...{
        breakpoint,
        routes,
        pathname,
        allowanceInfo,
        open,
        onToggle: undefined,
        Link: Link as LinkComponent,
        logoHref: websiteUrl,
        logoTarget: '_blank',
      }}
    />
  )
})
Sidebar.displayName = 'Sidebar'

export default Sidebar
