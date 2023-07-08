import { useState } from 'react'
import styled from 'styled-components'
import { Tabs } from '@aleph-front/aleph-core'
import CenteredContainer from '@/components/common/CenteredContainer'
import React from 'react'
import SSHKeysTabContent from '../SSHKeysTabContent'
import FunctionsTabContent from '../FunctionsTabContent/cmp'
import InstancesTabContent from '../InstancesTabContent'
import VolumesTabContent from '../VolumesTabContent/cmp'
import AllTabContent from '../AllTabContent'
import { useDashboardHomePage } from '@/hooks/pages/dashboard/useDashboardHomePage'

const Container = styled(CenteredContainer).attrs((props) => ({
  ...props,
  variant: 'dashboard',
}))``

export default function DashboardHomePage() {
  const { all, functions, instances, volumes, sshKeys } = useDashboardHomePage()

  const [tabId, setTabId] = useState('all')

  return (
    <>
      <Container>
        <div tw="py-10">
          <Tabs
            selected={tabId}
            tabs={[
              {
                id: 'all',
                name: 'All',
                label: `(${all.length})`,
                labelPosition: 'bottom',
              },
              {
                id: 'function',
                name: 'Functions',
                label: `(${functions.length})`,
                labelPosition: 'bottom',
              },
              {
                id: 'instance',
                name: 'Instances',
                label: `(${instances.length})`,
                labelPosition: 'bottom',
              },
              {
                id: 'volume',
                name: 'Immutable Volumes',
                label: `(${volumes.length})`,
                labelPosition: 'bottom',
              },
              {
                id: 'ssh',
                name: 'SSH Keys',
                label: `(${sshKeys.length})`,
                labelPosition: 'bottom',
              },
            ]}
            onTabChange={setTabId}
          />
        </div>
        <div role="tabpanel">
          {tabId === 'all' ? (
            <AllTabContent data={all} />
          ) : tabId === 'function' ? (
            <FunctionsTabContent data={functions} />
          ) : tabId === 'instance' ? (
            <InstancesTabContent data={instances} />
          ) : tabId === 'volume' ? (
            <VolumesTabContent data={volumes} />
          ) : tabId === 'ssh' ? (
            <SSHKeysTabContent data={sshKeys} />
          ) : (
            <></>
          )}
        </div>
        <p tw="my-24 text-center">
          Acquire aleph.im tokens for versatile access to resources within a
          defined duration. These tokens remain in your wallet without being
          locked or consumed, providing you with flexibility in utilizing
          aleph.im&apos;s infrastructure. If you choose to remove the tokens
          from your wallet, the allocated resources will be efficiently
          reclaimed. Feel free to use or hold the tokens according to your
          needs, even when not actively using Aleph.im&apos;s resources.
        </p>
      </Container>
    </>
  )
}
