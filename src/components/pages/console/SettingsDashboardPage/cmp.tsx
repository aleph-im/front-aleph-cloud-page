import React from 'react'
import Head from 'next/head'
import { Tabs } from '@aleph-front/core'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { useSettingsDashboardPage } from './hook'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import SSHKeysTabContent from '../sshKey/SSHKeysTabContent'
import DomainsTabContent from '../domain/DomainsTabContent'

export default function SettingsDashboardPage() {
  const { tabs, tabId, setTabId, domains, sshKeys } = useSettingsDashboardPage()

  return (
    <>
      <Head>
        <title>Console | Settings - Aleph Cloud</title>
        <meta name="description" content="Aleph Cloud Console Settings" />
      </Head>
      <CenteredContainer $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </CenteredContainer>
      <div role="tabpanel">
        {tabId === 'ssh' ? (
          <>
            {!!sshKeys?.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <SSHKeysTabContent data={sshKeys} />
              </CenteredContainer>
            )}
            <DashboardCardWithSideImage
              info="WHAT ARE..."
              title="SSH Keys"
              description="Securely manage your instances with SSH access. Use our SSH feature to establish secure connections, ensuring safe and efficient administration of your instances."
              imageSrc="/img/dashboard/ssh.svg"
              imageAlt="SSH Key illustration"
              withButton={sshKeys?.length === 0}
              buttonUrl="/console/settings/ssh/new"
              buttonText="Add SSH key"
            />
          </>
        ) : tabId === 'domain' ? (
          <>
            {!!domains?.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <DomainsTabContent data={domains} />
              </CenteredContainer>
            )}
            <DashboardCardWithSideImage
              info="WHAT ARE..."
              title="Custom domains"
              description="Link your custom domains effortlessly to functions, instances, volumes, or websites. Simplify your web3 hosting experience with streamlined domain management."
              imageSrc="/img/dashboard/domain.svg"
              imageAlt="Domain illustration"
              withButton={domains?.length === 0}
              buttonUrl="/console/settings/domain/new"
              buttonText="Create custom domain"
              externalLinkUrl="https://docs.aleph.im/computing/custom_domain/setup/"
            />
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
