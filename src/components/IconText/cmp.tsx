import { Icon } from '@aleph-front/aleph-core'
import { IconTextProps } from './types'

export default function IconText({
  children,
  onClick,
  iconName,
}: IconTextProps) {
  return (
    <div tw="flex items-baseline cursor-pointer" onClick={onClick}>
      <span tw="break-all">{children}</span>
      <Icon name={iconName} tw="cursor-pointer ml-2" />
    </div>
  )
}
