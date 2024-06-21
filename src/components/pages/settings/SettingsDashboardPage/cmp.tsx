import React from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import { useSettingsDashboardPage } from '@/hooks/pages/settings/useSettingsDashboardPage'
import SSHKeysTabContent from '../../dashboard/SSHKeysTabContent'
import DomainsTabContent from '../../dashboard/DomainsTabContent'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'

export default function SettingsDashboardPage() {
  const { tabs, tabId, setTabId, domains, sshKeys } = useSettingsDashboardPage()

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <div role="tabpanel">
        {tabId === 'ssh' ? (
          <>
            {!!sshKeys.length && (
              <Container $variant="xl" tw="my-10">
                <SSHKeysTabContent data={sshKeys} />
              </Container>
            )}
            <DashboardCardWithSideImage
              info="WHAT IS A..."
              title="SSH Key?"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum dignissim elit, ut maximus justo congue at. Nulla lobortis, ligula in tempus tincidunt, eros nulla congue sapien, ac aliquet mi ante non elit."
              imageSrc="/img/dashboard/ssh.svg"
              imageAlt="SSH Key illustration"
              withButton={sshKeys.length === 0}
              buttonUrl="/settings/ssh/new"
              buttonText="Create new SSH key"
              externalLinkUrl="#"
            />
          </>
        ) : tabId === 'domain' ? (
          <>
            {!!domains.length && (
              <Container $variant="xl" tw="my-10">
                <DomainsTabContent data={domains} />
              </Container>
            )}
            <DashboardCardWithSideImage
              info="WHAT IS A..."
              title="Domain?"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum dignissim elit, ut maximus justo congue at. Nulla lobortis, ligula in tempus tincidunt, eros nulla congue sapien, ac aliquet mi ante non elit."
              imageSrc="/img/dashboard/domain.svg"
              imageAlt="Domain illustration"
              withButton={domains.length === 0}
              buttonUrl="/settings/domain/new"
              buttonText="Create new domain"
              externalLinkUrl="#"
            />
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
