
import { NotificationProviderProps } from './types'
import { Notification } from "@aleph-front/aleph-core"
import { useEffect, useState } from 'react'

// @note: Take a look at https://nextjs.org/docs/messages/react-hydration-error#possible-ways-to-fix-it
export default function NotificationProvider({ children }: NotificationProviderProps) {
  const [isSSR, setIsSSR] = useState(true)
  useEffect(() => setIsSSR(false), [])

  return (
    isSSR ? (
      <div>{children}</div>
    ) : (
      <Notification max={10} timeout={2000}>
        {children}
      </Notification>
    )
  )
}
