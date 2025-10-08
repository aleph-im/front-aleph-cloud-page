import { websiteUrl } from '@/helpers/constants'
import { Footer as BaseFooter, LinkComponent } from '@aleph-front/core'
import Link from 'next/link'

export const Footer = () => {
  return (
    <BaseFooter
      small
      maxWidth="100%"
      Link={Link as LinkComponent}
      logoHref={websiteUrl}
      logoTarget="_blank"
      logoImg="aleph"
      logoByAleph={false}
      logoText="Aleph Cloud"
      breakpoint="lg"
      media={[
        {
          name: 'x',
          icon: 'x',
          label: 'Follow us',
          href: 'https://x.com/aleph_im',
          target: '_blank',
          small: true,
        },
        {
          name: 'blog',
          icon: 'aleph',
          label: 'Blog',
          href: 'https://www.aleph.cloud/blog',
          target: '_blank',
          small: true,
        },
      ]}
      mainLinks={[
        {
          label: 'Documentation',
          href: 'https://docs.aleph.cloud',
          target: '_blank',
        },
        {
          label: 'Telegram Developers',
          href: 'https://t.me/alephcloud',
          target: '_blank',
        },
      ]}
      buttons={[]}
      links={[]}
    />
  )
}

export default Footer
