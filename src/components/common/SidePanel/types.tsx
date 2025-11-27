export type SidePanelProps = {
  title: string
  isOpen: boolean
  onClose?: () => void
  children?: React.ReactNode
  footer?: React.ReactNode
}

export type StyledSidePanelProps = {
  $isOpen?: boolean
}
