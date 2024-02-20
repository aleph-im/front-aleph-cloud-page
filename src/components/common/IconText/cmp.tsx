import { memo } from 'react'
import { Icon } from '@aleph-front/core'
import { IconTextProps } from './types'
import { Text } from '@/components/pages/dashboard/common'

export const IconText = ({ children, onClick, iconName }: IconTextProps) => {
  return (
    <div tw="flex items-baseline cursor-pointer" onClick={onClick}>
      <Text tw="break-all">{children}</Text>
      <Icon name={iconName} tw="cursor-pointer ml-2" className="text-purple4" />
    </div>
  )
}
IconText.displayName = 'IconText'

export default memo(IconText) as typeof IconText
