import ButtonLink from '@/components/common/ButtonLink'
import Head from 'next/head'
import { useManageSSHKey } from './hook'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import BackButtonSection from '@/components/common/BackButtonSection'
import SSHKeyDetail from '@/components/common/SSHKeyDetail'

export default function ManageSSHKey() {
  const { sshKeyId, handleBack } = useManageSSHKey()

  return (
    <>
      <Head>
        <title>Console | Manage SSH Key | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your SSH keys on Aleph Cloud"
        />
      </Head>
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
