import React from 'react'
import Head from 'next/head'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { usePermissionsDashboardPage } from './hook'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import PermissionsTabContent from '../PermissionsTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'

export default function PermissionsDashboardPage() {
  const { permissions } = usePermissionsDashboardPage()

  return (
    <>
      <Head>
        <title>Console | Permissions | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage who has permissions to your resources in Aleph Cloud"
        />
      </Head>
      <div>
        {!!permissions?.length && (
          <CenteredContainer $variant="xl" tw="my-10">
            <PermissionsTabContent data={permissions} />
          </CenteredContainer>
        )}
        <DashboardCardWithSideImage
          imageSrc="/img/dashboard/instance.svg" // @todo: change illustration?
          imageAlt="Permissions illustration"
          info="WHAT ARE..."
          title="Permissions"
          description={
            <>
              <div className="tp-body2" tw="opacity-85">
                Ideal for teams, apps, or automated workloads.
              </div>{' '}
              Empower teammates or connected wallets to spend your credits
              safely. Grant permission to use your credits, define what they can
              deploy, and revoke access whenever you need.
            </>
          }
          withButton={permissions?.length === 0}
          buttonUrl="/console/permissions/new"
          buttonText="Create permissions"
        />
      </div>
      <CenteredContainer $variant="xl">
        <HoldTokenDisclaimer />
      </CenteredContainer>
    </>
  )
}
