import { Tabs } from '@aleph-front/core'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import VolumesTabContent from '../../volume/VolumesTabContent'
import DomainsTabContent from '../../domain/DomainsTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import { useConfidentialDashboardPage } from './hook'
import ConfidentialsTabContent from '../ConfidentialsTabContent'

export default function ConfidentialDashboardPage() {
  const { authorized, tabs, tabId, setTabId, confidentials, volumes, domains } =
    useConfidentialDashboardPage()

  if (!authorized) return

  return (
    <>
      <CenteredContainer $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </CenteredContainer>
      <div role="tabpanel">
        {tabId === 'confidential' ? (
          <>
            {!!confidentials?.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <ConfidentialsTabContent data={confidentials} />
              </CenteredContainer>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/instance.svg"
              imageAlt="Confidential illustration"
              info="WHAT IS A..."
              title="Confidential Instance"
              description="Protect your sensitive workloads with our Confidential VMs. Designed for maximum privacy and security, ensuring your execution and data stays safe."
              buttonUrl="/console/computing/confidential/new"
              buttonText="Create Confidential"
              externalLinkText="Developer docs"
              externalLinkUrl="https://docs.aleph.im/computing/confidential/"
            />
          </>
        ) : tabId === 'volume' ? (
          <>
            {!!volumes?.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <VolumesTabContent data={volumes} cta={false} />
              </CenteredContainer>
            )}
          </>
        ) : tabId === 'domain' ? (
          <>
            {!!domains?.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <DomainsTabContent data={domains} cta={false} />
              </CenteredContainer>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <CenteredContainer $variant="xl">
        <HoldTokenDisclaimer />
      </CenteredContainer>
    </>
  )
}
