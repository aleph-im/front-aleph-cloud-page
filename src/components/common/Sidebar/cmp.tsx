import { AnchorHTMLAttributes, ReactNode, memo, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IconName, LinkComponent, RouterSidebar } from '@aleph-front/core'
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
  const { routes, footerLinks } = useRoutes()
  const { pathname } = useRouter()
  const [open, setOpen] = useState<boolean>()

  // --------------------------------------------

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
      breakpoint={breakpoint}
      routes={routes}
      footerLinks={footerLinks}
      pathname={pathname}
      open={open}
      onToggle={setOpen}
      Link={Link as LinkComponent}
      logoHref={websiteUrl}
      logoTarget="_blank"
      logoImg="aleph"
    />
  )
})
Sidebar.displayName = 'Sidebar'

export default Sidebar
