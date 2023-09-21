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
import DomainsTabContent from '../DomainsTabContent/cmp'
import IPFSPinningTabContent from '../IPFSPinningTabContent'

const Container = styled(CenteredContainer).attrs((props) => ({
  ...props,
  variant: 'dashboard',
}))``

function getLabel(entities: unknown[], beta = false): string {
  const n = entities.length > 0 ? `(${entities.length})` : ''
  const b = beta ? 'BETA ' : ''
  return `${b}${n}`
}

export default function DashboardHomePage() {
  const { all, functions, instances, volumes, sshKeys, domains } =
    useDashboardHomePage()

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
                label: getLabel(all),
                labelPosition: 'bottom',
              },
              {
                id: 'function',
                name: 'Functions',
                label: getLabel(functions),
                labelPosition: 'bottom',
              },
              {
                id: 'instance',
                name: 'Instances',
                label: getLabel(instances, true),
                labelPosition: 'top',
              },
              {
                id: 'volume',
                name: 'Immutable Volumes',
                label: getLabel(volumes),
                labelPosition: 'bottom',
              },
              {
                id: 'ssh',
                name: 'SSH Keys',
                label: getLabel(sshKeys, true),
                labelPosition: 'top',
              },
              {
                id: 'domain',
                name: 'Domains',
                label: getLabel(domains, true),
                labelPosition: 'top',
              },
              {
                id: 'ipfs_pinning',
                name: 'IPFS Pinning',
                label: 'wip',
                labelPosition: 'top',
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
          ) : tabId === 'domain' ? (
            <DomainsTabContent data={domains} />
          ) : tabId === 'ipfs_pinning' ? (
            <IPFSPinningTabContent />
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
