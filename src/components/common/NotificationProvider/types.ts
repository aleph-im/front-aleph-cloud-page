import { NotificationProps } from '@aleph-front/core'

export type NotificationProviderProps = Omit<
  NotificationProps,
  'max' | 'timeout'
>
