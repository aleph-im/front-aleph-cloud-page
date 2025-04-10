import { TextArea } from '@aleph-front/core'
import { TextGradient } from '@aleph-front/core'
import { Separator } from '../../pages/console/common'
import { UseRequestExecutableLogsFeedReturn } from '@/hooks/common/useRequestEntity/useRequestExecutableLogsFeed'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'

export type LogsFeedProps = {
  logs: UseRequestExecutableLogsFeedReturn
}

export default function LogsFeed({ logs }: LogsFeedProps) {
  const isLoading = !logs?.stdout && !logs?.stderr

  return (
    <>
      <TextGradient type="h7" as="h2" color="main0">
        Stdout
      </TextGradient>
      <div tw="relative rounded-xl">
        <SpinnerOverlay show={isLoading} color="white" />

        <TextArea
          readOnly
          name="stdout"
          placeholder={isLoading ? 'Loading logs...' : 'No Stdout logs found'}
          value={logs?.stdout}
          tw="h-[30rem]"
          variant="code"
        />
      </div>

      <Separator />

      <TextGradient type="h7" as="h2" color="main0">
        Stderr
      </TextGradient>
      <div tw="relative rounded-xl ">
        <SpinnerOverlay show={isLoading} color="white" />

        <TextArea
          readOnly
          name="stderr"
          placeholder={isLoading ? 'Loading logs...' : 'No Stderr logs found'}
          value={logs?.stderr}
          tw="h-[30rem]"
          variant="code"
        />
      </div>
    </>
  )
}
