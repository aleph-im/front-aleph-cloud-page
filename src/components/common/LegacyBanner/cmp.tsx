import { memo } from 'react'

export const LegacyBanner = () => {
  return (
    <div tw="w-full bg-yellow-400 py-2.5 px-4 text-center">
      <p tw="text-black text-sm leading-snug">
        You can manage existing legacy instances here. Creating new resources
        and adding balance is available in{' '}
        <a
          href="https://credits.app.aleph.im"
          target="_blank"
          rel="noopener noreferrer"
          tw="underline font-bold hover:opacity-75 transition-opacity"
        >
          Credits
        </a>
        .
      </p>
    </div>
  )
}
LegacyBanner.displayName = 'LegacyBanner'

export default memo(LegacyBanner)
