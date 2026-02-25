import { memo } from 'react'
import 'twin.macro'
import BorderBox from '@/components/common/BorderBox'
import ExternalLink from '@/components/common/ExternalLink'
import { DeprecatedResourceBannerProps } from './types'

export const DeprecatedResourceBanner = ({
  resourceName,
  createUrl,
}: DeprecatedResourceBannerProps) => {
  return (
    <BorderBox $color="warning" tw="mt-10">
      <p className="tp-body1 fs-16 text-base2">
        Creating new {resourceName.toLowerCase()}s is now available in the new
        Credits console.
      </p>
      <p className="tp-body1 fs-16 text-base2" tw="mt-2">
        <ExternalLink
          href={createUrl}
          text="Go to Credits console"
          color="main0"
          tw="font-bold"
        />
      </p>
    </BorderBox>
  )
}
DeprecatedResourceBanner.displayName = 'DeprecatedResourceBanner'

export default memo(DeprecatedResourceBanner)
