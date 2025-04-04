import { websiteUrl } from '@/helpers/constants'
import { Footer as BaseFooter, LinkComponent } from '@aleph-front/core'
import Link from 'next/link'

export const Footer = () => {
  return (
    <BaseFooter
      {...{
        small: true,
        maxWidth: '100%',
        Link: Link as LinkComponent,
        logoHref: websiteUrl,
        logoTarget: '_blank',
        logoImg: 'aleph',
        logoByAleph: false,
        logoText: 'Aleph Cloud',
        breakpoint: 'lg',
        buttons: [
          {
            label: 'Work with us',
            href: `${websiteUrl}/contact`,
          },
          {
            label: 'Try our cloud',
            href: `${websiteUrl}`,
          },
          {
            label: 'Start a project',
            href: 'https://docs.aleph.im/computing/',
            target: '_blank',
          },
        ],
        media: [
          {
            name: 'x',
            icon: 'x',
            label: 'Follow us',
            href: 'https://twitter.com/TwentySixCloud',
            target: '_blank',
            small: true,
          },
          {
            name: 'telegram',
            icon: 'telegram',
            label: 'Telegram',
            href: 'https://t.me/alephim',
            target: '_blank',
          },
          {
            name: 'medium',
            icon: 'medium',
            label: 'Medium',
            href: 'https://medium.com/aleph-im',
            target: '_blank',
            small: true,
          },
        ],
        mainLinks: [
          {
            label: 'Documentation',
            href: 'https://docs.aleph.im',
            target: '_blank',
          },
          {
            label: 'Telegram Developers',
            href: 'https://t.me/alephim/119590',
            target: '_blank',
          },
        ],
        links: [
          {
            title: 'Solutions',
            links: [
              {
                label: 'Computing',
                href: '/console/computing/function/new/',
              },
              {
                label: 'Storage',
                href: '/console/storage/volume/new/',
              },
              {
                label: 'Custom domains',
                href: '/console/settings/domain/new/',
              },
              {
                label: 'SSH',
                href: '/console/settings/ssh/new/',
              },
            ],
          },
          {
            title: 'Developers',
            links: [
              {
                label: 'Documentation',
                href: 'https://docs.aleph.im',
                target: '_blank',
              },
              {
                label: 'Developer telegram',
                href: 'https://t.me/alephim/119590',
                target: '_blank',
              },
              {
                label: 'Github',
                href: 'https://github.com/aleph-im',
                target: '_blank',
              },
              {
                label: 'SDK',
                href: 'https://docs.aleph.im/libraries/Aleph.im-Python-SDK/',
                target: '_blank',
              },
            ],
          },
          {
            title: 'Why twentysix',
            links: [
              {
                label: 'What is twentysix cloud?',
                href: `${websiteUrl}/what-is-twentysix-cloud`,
              },
              {
                label: 'Choosing twentysix cloud',
                href: `${websiteUrl}/choosing-twentysix-cloud`,
              },
              {
                label: 'Decentralized cloud solution',
                href: `${websiteUrl}/decentralized-cloud-solution`,
              },
              {
                label: 'What is decentralized cloud computing?',
                href: `${websiteUrl}/what-is-decentralized-cloud-computing`,
              },
            ],
          },
          {
            title: 'About',
            links: [
              {
                label: 'Media kit',
                href: 'https://ipfs.aleph.cloud/ipfs/QmaFMoSzV3tncoHsD4bDKKqLHWrAQjGM2hWeDXSwoD2DCs?filename=twentysix-media.zip',
                target: '_blank',
              },
              {
                label: 'Aleph Cloud technology',
                href: 'https://aleph.im',
                target: '_blank',
              },
            ],
          },
        ],
      }}
    />
  )
}

export default Footer
