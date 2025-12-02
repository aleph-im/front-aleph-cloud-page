export type SidePanelProps = {
  title: string
  isOpen: boolean
  onClose?: () => void
  children?: React.ReactNode
  order?: number
  width?: string
  mobileHeight?: string
}

export type StyledSidePanelProps = {
  $isOpen?: boolean
  $order?: number
  $width?: string
  $mobileHeight?: string
}
