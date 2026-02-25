import DeprecatedNewResourcePage from '@/components/common/DeprecatedNewResourcePage'
import { NAVIGATION_URLS } from '@/helpers/constants'

export default function NewInstancePage() {
  return (
    <DeprecatedNewResourcePage
      resourceName="Instance"
      creditConsoleUrl={NAVIGATION_URLS.creditConsole.computing.instances.new}
      listUrl={NAVIGATION_URLS.console.computing.instances.home}
    />
  )
}
