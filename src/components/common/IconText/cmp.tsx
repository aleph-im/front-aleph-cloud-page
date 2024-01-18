import { memo } from 'react'
import { Icon } from '@aleph-front/core'
import { IconTextProps } from './types'

export const IconText = ({ children, onClick, iconName }: IconTextProps) => {
  return (
    <div tw="flex items-baseline cursor-pointer" onClick={onClick}>
      <span tw="break-all">{children}</span>
      <Icon name={iconName} tw="cursor-pointer ml-2" />
    </div>
  )
}
IconText.displayName = 'IconText'

export default memo(IconText) as typeof IconText
