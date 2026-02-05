import { ReactNode } from 'react'

export type MenuItem = {
  label: string
  href?: string
  onClick?: () => void
  disabled?: boolean
}

export type DetailsMenuButtonProps = {
  menuItems: MenuItem[]
  icon?: ReactNode
  disabled?: boolean
}
