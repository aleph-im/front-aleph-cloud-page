import { NotificationProps } from '@aleph-front/aleph-core'

export type NotificationProviderProps = Omit<
  NotificationProps,
  'max' | 'timeout'
>
