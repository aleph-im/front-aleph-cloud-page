import React, { memo } from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import { useFunctionDashboardPage } from '@/components/pages/console/computing/FunctionDashboardPage/hook'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import FunctionsTabContent from '../../dashboard/FunctionsTabContent'
import VolumesTabContent from '../../dashboard/VolumesTabContent'
import DomainsTabContent from '../../dashboard/DomainsTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'

function FunctionDashboardPage() {
  const { tabs, tabId, setTabId, programs, volumes, domains } =
    useFunctionDashboardPage()

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <div role="tabpanel">
        {tabId === 'program' ? (
          <>
            {!!programs?.length && (
              <Container $variant="xl" tw="my-10">
                <FunctionsTabContent data={programs} />
              </Container>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/function.svg"
              imageAlt="Function illustration"
              info="WHAT ARE..."
              title="Functions"
              description="Deploy and manage serverless functions effortlessly with our robust computing platform. Run code on-demand or persistently, with seamless integration and scalability."
              withButton={programs?.length === 0}
              buttonUrl="/computing/function/new"
              buttonText="Create function"
              externalLinkUrl="https://docs.aleph.im/tools/webconsole/"
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

export default memo(FunctionDashboardPage)
