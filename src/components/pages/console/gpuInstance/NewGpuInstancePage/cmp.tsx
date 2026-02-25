import DeprecatedNewResourcePage from '@/components/common/DeprecatedNewResourcePage'
import { NAVIGATION_URLS } from '@/helpers/constants'

export default function NewGpuInstancePage() {
  return (
    <DeprecatedNewResourcePage
      resourceName="GPU Instance"
      creditConsoleUrl={NAVIGATION_URLS.creditConsole.computing.gpus.new}
      listUrl={NAVIGATION_URLS.console.computing.gpus.home}
    />
  )
}
