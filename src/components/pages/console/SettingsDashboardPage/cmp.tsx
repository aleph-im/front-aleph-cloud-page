import React from 'react'
import Head from 'next/head'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { useSettingsDashboardPage } from './hook'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import SSHKeysTabContent from '../sshKey/SSHKeysTabContent'
import { NAVIGATION_URLS } from '@/helpers/constants'

export default function SettingsDashboardPage() {
  const { sshKeys } = useSettingsDashboardPage()

  return (
    <>
      <Head>
        <title>Console | Settings | Aleph Cloud</title>
        <meta name="description" content="Aleph Cloud Console Settings" />
      </Head>
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
        buttonUrl={NAVIGATION_URLS.console.settings.ssh.new}
        buttonText="Add SSH key"
      />
      <CenteredContainer $variant="xl">
        <HoldTokenDisclaimer />
      </CenteredContainer>
    </>
  )
}
