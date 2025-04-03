import React from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import { useSettingsDashboardPage } from '@/components/pages/console/settings/SettingsDashboardPage/hook'
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
            {!!sshKeys?.length && (
              <Container $variant="xl" tw="my-10">
                <SSHKeysTabContent data={sshKeys} />
              </Container>
            )}
            <DashboardCardWithSideImage
              info="WHAT ARE..."
              title="SSH Keys"
              description="Securely manage your instances with SSH access. Use our SSH feature to establish secure connections, ensuring safe and efficient administration of your instances."
              imageSrc="/img/dashboard/ssh.svg"
              imageAlt="SSH Key illustration"
              withButton={sshKeys?.length === 0}
              buttonUrl="/settings/ssh/new"
              buttonText="Add SSH key"
            />
          </>
        ) : tabId === 'domain' ? (
          <>
            {!!domains?.length && (
              <Container $variant="xl" tw="my-10">
                <DomainsTabContent data={domains} />
              </Container>
            )}
            <DashboardCardWithSideImage
              info="WHAT ARE..."
              title="Custom domains"
              description="Link your custom domains effortlessly to functions, instances, volumes, or websites. Simplify your web3 hosting experience with streamlined domain management."
              imageSrc="/img/dashboard/domain.svg"
              imageAlt="Domain illustration"
              withButton={domains?.length === 0}
              buttonUrl="/settings/domain/new"
              buttonText="Create custom domain"
              externalLinkUrl="https://docs.aleph.im/computing/custom_domain/setup/"
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
