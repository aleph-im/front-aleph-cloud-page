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
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { NAVIGATION_URLS } from '@/helpers/constants'

export default function PermissionsDashboardPage({ mainRef }: PageProps) {
  const { permissions, manager, refetchPermissions } =
    usePermissionsDashboardPage()
  const { noti, next, stop } = useCheckoutNotification({})
  const [pendingChanges, setPendingChanges] = useState<
    Map<string, AccountPermissions>
  >(new Map())
  const [originalPermissions, setOriginalPermissions] = useState<
    AccountPermissions[]
  >([])

  // Sync original permissions and clear pending changes when permissions load
  React.useEffect(() => {
    if (permissions) {
      setOriginalPermissions(permissions)
      setPendingChanges(new Map())
    }
  }, [permissions])

  const handlePermissionChange = useCallback(
    (updatedPermission: AccountPermissions) => {
      // Find the original permission to compare
      const originalPermission = originalPermissions.find(
        (p) => p.id === updatedPermission.id,
      )

      // @ts-expect-error TS7053 - Ignore 'key' property added by Table component
      delete updatedPermission['key'] // Remove key added by Table

      setPendingChanges((prev) => {
        const newChanges = new Map(prev)

        // Compare updated vs original using JSON.stringify
        const hasRealChanges =
          JSON.stringify(updatedPermission) !==
          JSON.stringify(originalPermission)

        console.log('original', originalPermission)
        console.log('updated', updatedPermission)
        console.log('hasRealChanges', hasRealChanges)

        if (hasRealChanges) {
          // Add to pending changes if different from original
          newChanges.set(updatedPermission.id, updatedPermission)
        } else {
          // Remove from pending changes if reverted to original
          newChanges.delete(updatedPermission.id)
        }

        return newChanges
      })
    },
    [originalPermissions],
  )

  const handleSaveAllChanges = useCallback(async () => {
    if (!manager) return

    const permissionsToUpdate = Array.from(pendingChanges.values())

    const iSteps = await manager.getAddSteps()
    const nSteps = iSteps.map((i) => stepsCatalog[i])

    const steps = manager.updatePermissionsSteps(permissionsToUpdate)

    let result

    try {
      while (!result) {
        const { value, done } = await steps.next()

        if (done) {
          result = value
          break
        }

        await next(nSteps)
      }

      setPendingChanges(new Map())
    } finally {
      await stop()

      if (result) {
        noti?.add({
          variant: 'info',
          title: 'Permissions updated',
          text: 'Refreshing permissions data...',
        })

        // Wait 2 seconds to refetch latest data from backend
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Refresh permissions data from backend
        await refetchPermissions()
      }
    }
  }, [manager, pendingChanges, next, stop, noti, refetchPermissions])

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
          buttonUrl={NAVIGATION_URLS.console.permissions.new}
          buttonText="Create permissions"
        />
      </div>
      <CenteredContainer $variant="xl">
        <HoldTokenDisclaimer />
      </CenteredContainer>
      {pendingChanges.size && (
        <FloatingFooter containerRef={mainRef} shouldHide={false}>
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
      )}
    </>
  )
}
