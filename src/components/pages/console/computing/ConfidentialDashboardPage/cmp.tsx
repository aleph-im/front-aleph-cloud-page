import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import VolumesTabContent from '../../dashboard/VolumesTabContent'
import DomainsTabContent from '../../dashboard/DomainsTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import { useConfidentialDashboardPage } from '@/components/pages/console/computing/ConfidentialDashboardPage/hook'
import ConfidentialsTabContent from '../../dashboard/ConfidentialsTabContent'

export default function ConfidentialDashboardPage() {
  const { authorized, tabs, tabId, setTabId, confidentials, volumes, domains } =
    useConfidentialDashboardPage()

  if (!authorized) return

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <div role="tabpanel">
        {tabId === 'confidential' ? (
          <>
            {!!confidentials?.length && (
              <Container $variant="xl" tw="my-10">
                <ConfidentialsTabContent data={confidentials} />
              </Container>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/instance.svg"
              imageAlt="Confidential illustration"
              info="WHAT IS A..."
              title="Confidential Instance"
              description="Protect your sensitive workloads with our Confidential VMs. Designed for maximum privacy and security, ensuring your execution and data stays safe."
              buttonUrl="/computing/confidential/new"
              buttonText="Create Confidential"
              externalLinkText="Developer docs"
              externalLinkUrl="https://docs.aleph.im/computing/confidential/"
            />
          </>
        ) : tabId === 'volume' ? (
          <>
            {!!volumes?.length && (
              <Container $variant="xl" tw="my-10">
                <VolumesTabContent data={volumes} cta={false} />
              </Container>
            )}
          </>
        ) : tabId === 'domain' ? (
          <>
            {!!domains?.length && (
              <Container $variant="xl" tw="my-10">
                <DomainsTabContent data={domains} cta={false} />
              </Container>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <Container $variant="xl">
        <HoldTokenDisclaimer />
      </Container>
    </>
  )
}
