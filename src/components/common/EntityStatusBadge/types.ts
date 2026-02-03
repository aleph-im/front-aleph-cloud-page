import { IconName } from '@aleph-front/core'

export type StatusVariant = 'success' | 'warning' | 'error' | 'info'

export type EntityStatusBadgeProps = {
  /**
   * Icon to display in the badge
   */
  icon?: IconName

  /**
   * Status text to display
   */
  text: string

  /**
   * Visual variant for the badge
   */
  variant: StatusVariant

  /**
   * Whether to show a loading spinner
   */
  showSpinner?: boolean
}
