import React from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import { useFunctionDashboardPage } from '@/hooks/pages/computing/useFunctionDashboardPage'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import FunctionsTabContent from '../../dashboard/FunctionsTabContent'
import VolumesTabContent from '../../dashboard/VolumesTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'

export default function FunctionDashboardPage() {
  const { tabs, tabId, setTabId, programs, volumes } =
    useFunctionDashboardPage()

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <div role="tabpanel">
        {tabId === 'program' ? (
          <>
            {!!programs.length && (
              <Container $variant="xl" tw="my-10">
                <FunctionsTabContent data={programs} />
              </Container>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/function.svg"
              imageAlt="Function illustration"
              info="WHAT IS A..."
              title="Function"
              description="Basicly, serverless computing at your fingertips (Lambda). Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum dignissim elit, ut maximus justo congue at. Nulla lobortis, ligula in tempus tincidunt, eros nulla congue sapien, ac aliquet mi ante non elit."
              buttonUrl="/computing/function/new"
              buttonText="Create function"
              externalLinkUrl="https://docs.aleph.im/computing/#persistent-execution"
            />
          </>
        ) : tabId === 'volume' ? (
          <>
            {!!volumes.length && (
              <Container $variant="xl" tw="my-10">
                <VolumesTabContent data={volumes} />
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
