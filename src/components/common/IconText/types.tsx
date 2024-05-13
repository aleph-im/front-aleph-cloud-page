import { IconName } from '@fortawesome/fontawesome-svg-core'
import { ReactNode } from 'react'

export type IconTextProps = {
  children?: ReactNode
  iconName: IconName
  onClick?: () => void
}
