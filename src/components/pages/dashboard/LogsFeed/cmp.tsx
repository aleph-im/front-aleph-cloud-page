import { TextArea } from '@aleph-front/core'
import { TextGradient } from '@aleph-front/core'
import { Separator } from '../common'
import { UseRequestExecutableLogsFeedReturn } from '@/hooks/common/useRequestEntity/useRequestExecutableLogsFeed'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'

export type LogsFeedProps = {
  logs: UseRequestExecutableLogsFeedReturn
}

export default function LogsFeed({ logs }: LogsFeedProps) {
  return (
    <>
      <TextGradient type="h7" as="h2" color="main0">
        Stdout
      </TextGradient>
      <div tw="relative">
        <SpinnerOverlay show={!logs?.stdout} color="white" />

        <TextArea
          readOnly
          name="stdout"
          placeholder="Loading logs..."
          value={logs?.stdout}
          tw="h-[30rem]"
          variant="code"
        />
      </div>

      <Separator />

      <TextGradient type="h7" as="h2" color="main0">
        Stderr
      </TextGradient>
      <div tw="relative">
        <SpinnerOverlay show={!logs?.stderr} color="white" />

        <TextArea
          readOnly
          name="stderr"
          placeholder="Loading logs..."
          value={logs?.stderr}
          tw="h-[30rem]"
          variant="code"
        />
      </div>
    </>
  )
}
