import DeprecatedNewResourcePage from '@/components/common/DeprecatedNewResourcePage'
import { NAVIGATION_URLS } from '@/helpers/constants'

export default function NewWebsitePage() {
  return (
    <DeprecatedNewResourcePage
      resourceName="Website"
      creditConsoleUrl={NAVIGATION_URLS.creditConsole.hosting.websites.new}
      listUrl={NAVIGATION_URLS.console.web3Hosting.website.home}
    />
  )
}
