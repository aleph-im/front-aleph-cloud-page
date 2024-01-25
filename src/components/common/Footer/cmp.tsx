import { Footer as BaseFooter } from '@aleph-front/core'

export const Footer = () => {
  return (
    <BaseFooter
      {...{
        small: true,
        buttons: [
          {
            label: 'Work with us',
            href: 'https://twentysix.cloud/contact',
          },
          {
            label: 'Try our cloud',
            href: 'https://twentysix.cloud',
          },
          {
            label: 'Start a project',
            href: 'https://docs.aleph.im/computing/',
          },
        ],
        media: [
          {
            name: 'x',
            icon: 'x',
            label: 'Follow us',
            href: 'https://twitter.com/TwentySixCloud',
            small: true,
          },
          {
            name: 'telegram',
            icon: 'telegram',
            label: 'Telegram',
            href: 'https://t.me/alephim',
          },
          {
            name: 'medium',
            icon: 'medium',
            label: 'Medium',
            href: 'https://medium.com/aleph-im',
            small: true,
          },
        ],
        mainLinks: [
          {
            label: 'Documentation',
            href: 'https://docs.aleph.im',
          },
          {
            label: 'Telegram Developers',
            href: 'https://t.me/alephim/119590',
          },
        ],
        links: [
          {
            title: 'Solutions',
            links: [
              {
                label: 'Computing',
                href: 'https://console.twentysix.cloud/computing/function/new/',
              },
              {
                label: 'Storage',
                href: 'https://console.twentysix.cloud/storage/volume/new/',
              },
              {
                label: 'Custom domains',
                href: 'https://console.twentysix.cloud/configure/domain/new/',
              },
              {
                label: 'SSH',
                href: 'https://console.twentysix.cloud/configure/ssh/new/',
              },
            ],
          },
          {
            title: 'Developers',
            links: [
              {
                label: 'Documentation',
                href: 'https://docs.aleph.im',
              },
              {
                label: 'Developer telegram',
                href: 'https://t.me/alephim/119590',
              },
              {
                label: 'Github',
                href: 'https://github.com/aleph-im',
              },
              {
                label: 'SDK',
                href: 'https://docs.aleph.im/libraries/Aleph.im-Python-SDK/',
              },
            ],
          },
          {
            title: 'Why twentysix',
            links: [
              {
                label: 'What is twentysix cloud?',
                href: 'https://twentysix.cloud/what-is-twentysix-cloud',
              },
              {
                label: 'Choosing twentysix cloud',
                href: 'https://twentysix.cloud/choosing-twentysix-cloud',
              },
              {
                label: 'Decentralized cloud solution',
                href: 'https://twentysix.cloud/decentralize-cloud-solution',
              },
              {
                label: 'What is decentralized cloud computing?',
                href: 'https://twentysix.cloud/what-is-decentralized-cloud-computing',
              },
            ],
          },
          {
            title: 'About',
            links: [
              {
                label: 'Media kit',
                href: 'https://ipfs.aleph.cloud/ipfs/QmaFMoSzV3tncoHsD4bDKKqLHWrAQjGM2hWeDXSwoD2DCs?filename=twentysix-media.zip',
              },
              {
                label: 'Aleph.im technology',
                href: 'https://aleph.im',
              },
            ],
          },
        ],
      }}
    />
  )
}

export default Footer
