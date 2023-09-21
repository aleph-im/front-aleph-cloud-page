import ButtonLink from '@/components/common/ButtonLink'

export default function IPFSPinningContent() {
  return (
    <div tw="mt-20 text-center">
      <ButtonLink variant="primary" href="/dashboard/ipfs_pinning">
        Pin a file/folder on IPFS
      </ButtonLink>
    </div>
  )
}
