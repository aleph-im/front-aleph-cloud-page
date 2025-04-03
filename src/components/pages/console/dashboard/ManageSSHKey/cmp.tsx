import ButtonLink from '@/components/common/ButtonLink'
import { useManageSSHKey } from '@/components/pages/console/dashboard/ManageSSHKey/hook'
import { Container } from '../common'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import BackButtonSection from '@/components/common/BackButtonSection'
import SSHKeyDetail from '@/components/common/SSHKeyDetail'

export default function ManageSSHKey() {
  const { sshKeyId, handleBack } = useManageSSHKey()

  return (
    <>
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <SSHKeyDetail sshKeyId={sshKeyId} showDelete />

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/settings/ssh/new">
              Add new SSH Key
            </ButtonLink>
          </div>
        </Container>
        <Container>
          <HoldTokenDisclaimer />
        </Container>
      </section>
    </>
  )
}
