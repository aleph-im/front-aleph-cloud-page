import { ReactNode } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets'
import { PRIVY_APP_ID, privyConfig } from '@/config/privy'

/**
 * Wraps children with Privy + Smart Wallets providers.
 *
 * Placed above ReownProvider in _app.tsx so Privy hooks are available
 * throughout the app. The paymaster / bundler provider is configured in the
 * Privy Dashboard (not here) to keep Pimlico/Alchemy/Biconomy swappable
 * without a code deploy.
 *
 * If NEXT_PUBLIC_PRIVY_APP_ID is missing, this renders children unchanged so
 * local dev without Privy credentials still works (Privy hooks will report
 * `ready: false` forever, and Privy-specific code paths short-circuit).
 */
export function PrivyProviders({ children }: { children: ReactNode }) {
  if (!PRIVY_APP_ID) {
    if (typeof window !== 'undefined') {
      console.warn(
        '[Privy] NEXT_PUBLIC_PRIVY_APP_ID is not set. Privy login is disabled; Reown remains available.',
      )
    }
    return <>{children}</>
  }

  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      <SmartWalletsProvider>{children}</SmartWalletsProvider>
    </PrivyProvider>
  )
}
