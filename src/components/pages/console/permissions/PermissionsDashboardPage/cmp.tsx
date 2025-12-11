import React, { useCallback, useState } from 'react'
import Head from 'next/head'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { usePermissionsDashboardPage } from './hook'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import PermissionsTabContent from '../PermissionsTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import FloatingFooter from '@/components/form/FloatingFooter'
import { PageProps } from '@/types/types'
import { AccountPermissions } from '@/domain/permissions'
import { Button } from '@aleph-front/core'

export default function PermissionsDashboardPage({ mainRef }: PageProps) {
  const { permissions } = usePermissionsDashboardPage()
  const [pendingChanges, setPendingChanges] = useState<
    Map<string, AccountPermissions>
  >(new Map())

  const handlePermissionChange = useCallback(
    (updatedPermission: AccountPermissions) => {
      setPendingChanges((prev) => {
        const newChanges = new Map(prev)
        newChanges.set(updatedPermission.id, updatedPermission)
        return newChanges
      })
    },
    [],
  )

  const handleSaveAllChanges = useCallback(() => {
    console.log('Saving all changes:', pendingChanges)
    // @todo: implement actual save logic here
    setPendingChanges(new Map())
  }, [pendingChanges])

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
            <PermissionsTabContent
              data={permissions}
              onPermissionChange={handlePermissionChange}
            />
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
      <FloatingFooter
        containerRef={mainRef}
        shouldHide={pendingChanges.size === 0}
      >
        <div tw="flex justify-end items-center w-full py-4 px-6">
          <Button
            color="main0"
            variant="primary"
            onClick={handleSaveAllChanges}
          >
            Save changes
          </Button>
        </div>
      </FloatingFooter>
    </>
  )
}
