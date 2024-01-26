import { memo } from 'react'
import { Icon } from '@aleph-front/core'
import { IconTextProps } from './types'
import { GrayText } from '@/components/pages/dashboard/common'

export const IconText = ({ children, onClick, iconName }: IconTextProps) => {
  return (
    <div tw="flex items-baseline cursor-pointer" onClick={onClick}>
      <GrayText tw="break-all">{children}</GrayText>
      <Icon name={iconName} tw="cursor-pointer ml-2" />
    </div>
  )
}
IconText.displayName = 'IconText'

export default memo(IconText) as typeof IconText
