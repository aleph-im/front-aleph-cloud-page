import CompositeTitle from '@/components/common/CompositeTitle'
import { Container } from '../manage/common'
import AddIPFSFileOrCid from '@/components/form/AddIPFSFileOrCid'
import { useNewIPFSPinningPage } from '@/hooks/pages/dashboard/useNewIPFSPinningPage'

export default function NewIPFSPinningPage() {
  const { control } = useNewIPFSPinningPage()
  return (
    <div>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <CompositeTitle as="h2" number="1">
            Start your IPFS Pinning process
          </CompositeTitle>
          <p>
            Upload your file, folder, or provide your CID link, and we'll take
            care of automatically pinning your data to the IPFS network.
          </p>
          <AddIPFSFileOrCid />
        </Container>
      </section>
    </div>
  )
}
