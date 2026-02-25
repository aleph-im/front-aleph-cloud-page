import DeprecatedNewResourcePage from '@/components/common/DeprecatedNewResourcePage'
import { NAVIGATION_URLS } from '@/helpers/constants'

export default function NewConfidentialPage() {
  return (
    <DeprecatedNewResourcePage
      resourceName="TEE Instance"
      creditConsoleUrl={
        NAVIGATION_URLS.creditConsole.computing.confidentials.new
      }
      listUrl={NAVIGATION_URLS.console.computing.confidentials.home}
    />
  )
}
