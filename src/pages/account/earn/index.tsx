import { useRedirect } from '@/hooks/common/useRedirect'
import { memo } from 'react'
import { NAVIGATION_URLS } from '@/helpers/constants'
import Head from 'next/head'

export function AccountEarnHomePage() {
  useRedirect(NAVIGATION_URLS.account.earn.staking)

  return (
    <Head>
      <title>Aleph token staking | Aleph Cloud</title>
      <meta
        name="description"
        content="Control your Aleph Cloud account, manage staking, and unlock decentralized connectivity. Earn rewards for supporting confidential, decentralized cloud infrastructure."
      />
    </Head>
  )
}

export default memo(AccountEarnHomePage)
