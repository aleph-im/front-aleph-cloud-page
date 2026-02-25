import DeprecatedNewResourcePage from '@/components/common/DeprecatedNewResourcePage'
import { NAVIGATION_URLS } from '@/helpers/constants'

export function NewVolumePage() {
  return (
    <DeprecatedNewResourcePage
      resourceName="Volume"
      creditConsoleUrl={NAVIGATION_URLS.creditConsole.storage.volumes.new}
      listUrl={NAVIGATION_URLS.console.storage.volumes.home}
    />
  )
}

export default NewVolumePage
