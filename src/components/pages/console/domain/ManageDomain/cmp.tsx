import Head from 'next/head'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import ButtonLink from '@/components/common/ButtonLink'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import BackButtonSection from '@/components/common/BackButtonSection'
import { useManageDomain } from './hook'
import DomainDetail from '@/components/common/DomainDetail'

export default function ManageDomain() {
  const { domainId, handleBack } = useManageDomain()

  return (
    <>
      <Head>
        <title>Console | Manage Domain | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your domain settings on Aleph Cloud"
        />
      </Head>
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <CenteredContainer>
          <DomainDetail domainId={domainId} showDelete />

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/console/settings/domain/new">
              Add new domain
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
