import { Icon } from '@aleph-front/aleph-core'
import { IconTextProps } from './types'

export default function IconText({ text, callback, iconName }: IconTextProps) {
  return (
    <div tw="flex items-baseline">
      <span>{text}</span>
      <Icon name={iconName} onClick={callback} tw="cursor-pointer ml-2" />
    </div>
  )
}
