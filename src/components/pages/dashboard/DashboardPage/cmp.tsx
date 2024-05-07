import { useState } from 'react'
import styled from 'styled-components'
import { Tabs } from '@aleph-front/core'
import CenteredContainer from '@/components/common/CenteredContainer'
import React from 'react'
import SSHKeysTabContent from '../SSHKeysTabContent'
import FunctionsTabContent from '../FunctionsTabContent'
import InstancesTabContent from '../InstancesTabContent'
import VolumesTabContent from '../VolumesTabContent'
import WebsitesTabContent from '../WebsitesTabContent'
import AllTabContent from '../AllTabContent'
import { useDashboardPage } from '@/hooks/pages/solutions/useDashboardPage'
import DomainsTabContent from '../DomainsTabContent'
import { useSPARedirect } from '@/hooks/common/useSPARedirect'

const Container = styled(CenteredContainer).attrs((props) => ({
  ...props,
  variant: 'dashboard',
}))``

function getLabel(entities: unknown[], beta = false): string {
  const n = entities.length > 0 ? `(${entities.length})` : ''
  const b = beta ? 'BETA ' : ''
  return `${b}${n}`
}

export default function DashboardPage() {
  useSPARedirect()

  const { all, functions, instances, volumes, sshKeys, domains, websites } =
    useDashboardPage()

  const [tabId, setTabId] = useState('all')

  return (
    <>
      <Container $variant="xl">
        <div tw="py-10">
          <Tabs
            selected={tabId}
            tabs={[
              {
                id: 'all',
                name: 'All',
                label: { label: getLabel(all), position: 'bottom' },
              },
              {
                id: 'function',
                name: 'Functions',
                label: { label: getLabel(functions), position: 'bottom' },
              },
              {
                id: 'instance',
                name: 'Instances',
                label: { label: getLabel(instances, true), position: 'top' },
              },
              {
                id: 'website',
                name: 'Websites',
                label: { label: getLabel(websites, true), position: 'top' },
              },
              {
                id: 'volume',
                name: 'Volumes',
                label: { label: getLabel(volumes), position: 'bottom' },
              },
              {
                id: 'ssh',
                name: 'SSH Keys',
                label: { label: getLabel(sshKeys, true), position: 'top' },
              },
              {
                id: 'domain',
                name: 'Domains',
                label: { label: getLabel(domains, true), position: 'top' },
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
          ) : tabId === 'website' ? (
            <WebsitesTabContent data={websites} />
          ) : tabId === 'volume' ? (
            <VolumesTabContent data={volumes} />
          ) : tabId === 'ssh' ? (
            <SSHKeysTabContent data={sshKeys} />
          ) : tabId === 'domain' ? (
            <DomainsTabContent data={domains} />
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
