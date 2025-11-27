type ThemeColorKey =
  | 'white'
  | 'black'
  | 'translucid'
  | 'base0'
  | 'base1'
  | 'base2'
  | 'main0'
  | 'main1'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'disabled'
  | 'disabled2'
  | 'background'
  | 'contentBackground'
  | 'foreground'
  | 'text'
  | 'light0'
  | 'light1'
  | 'purple0'
  | 'purple1'
  | 'purple2'
  | 'purple3'
  | 'purple4'

export type StyledTableProps = {
  clickableRows?: boolean
  rowBackgroundColors?: [ThemeColorKey, ThemeColorKey]
}
