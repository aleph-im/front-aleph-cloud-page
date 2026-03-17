import { memo } from 'react'
import BorderBox from '@/components/common/BorderBox'
import ExternalLink from '@/components/common/ExternalLink'
import { CREDITS_BASE_URL } from '@/helpers/constants'

export const LegacyBanner = () => {
  return (
    <BorderBox $color="warning">
      <p className="tp-body1 fs-16 text-base2">
        You can manage existing legacy instances here.
      </p>
      <p className="tp-body1 fs-16 text-base2">
        Creating new resources and adding balance is available in{' '}
        <ExternalLink
          href={CREDITS_BASE_URL}
          text="Credits"
          color="base2"
          underline
          tw="font-bold hover:opacity-75 transition-opacity"
        />
      </p>
    </BorderBox>
  )
}
LegacyBanner.displayName = 'LegacyBanner'

export default memo(LegacyBanner)
