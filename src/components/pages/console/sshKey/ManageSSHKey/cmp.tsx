import ButtonLink from '@/components/common/ButtonLink'
import { useManageSSHKey } from './hook'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import BackButtonSection from '@/components/common/BackButtonSection'
import SSHKeyDetail from '@/components/common/SSHKeyDetail'

export default function ManageSSHKey() {
  const { sshKeyId, handleBack } = useManageSSHKey()

  return (
    <>
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <CenteredContainer>
          <SSHKeyDetail sshKeyId={sshKeyId} showDelete />

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/console/settings/ssh/new">
              Add new SSH Key
            </ButtonLink>
          </div>
        </CenteredContainer>
        <CenteredContainer>
          <HoldTokenDisclaimer />
        </CenteredContainer>
      </section>
    </>
  )
}
