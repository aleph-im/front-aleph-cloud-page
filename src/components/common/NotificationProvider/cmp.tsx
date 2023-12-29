import { NotificationProviderProps } from './types'
import { Notification } from '@aleph-front/aleph-core'
import { memo, useEffect, useState } from 'react'

// @note: Take a look at https://nextjs.org/docs/messages/react-hydration-error#possible-ways-to-fix-it
export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [isSSR, setIsSSR] = useState(true)
  useEffect(() => setIsSSR(false), [])

  return isSSR ? (
    <>{children}</>
  ) : (
    <Notification max={10} timeout={2000}>
      {children}
    </Notification>
  )
}
NotificationProvider.displayName = 'NotificationProvider'

export default memo(NotificationProvider) as typeof NotificationProvider
