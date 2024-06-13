import { useState } from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
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
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'

function getLabel(entities: unknown[], beta = false): string {
  const n = entities.length > 0 ? `(${entities.length})` : ''
  const b = beta ? 'BETA ' : ''
  return `${b}${n}`
}

export default function DashboardPage() {
  useSPARedirect()

  const { all, programs, instances, volumes, sshKeys, domains, websites } =
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
                id: 'website',
                name: 'Websites',
                label: { label: getLabel(websites, true), position: 'top' },
              },
              {
                id: 'function',
                name: 'Functions',
                label: { label: getLabel(programs), position: 'bottom' },
              },
              {
                id: 'instance',
                name: 'Instances',
                label: { label: getLabel(instances, true), position: 'top' },
              },
              {
                id: 'volume',
                name: 'Volumes',
                label: { label: getLabel(volumes), position: 'bottom' },
              },
              {
                id: 'domain',
                name: 'Domains',
                label: { label: getLabel(domains, true), position: 'top' },
              },
              {
                id: 'ssh',
                name: 'SSH Keys',
                label: { label: getLabel(sshKeys, true), position: 'top' },
              },
            ]}
            onTabChange={setTabId}
          />
        </div>
        <div role="tabpanel">
          {tabId === 'all' ? (
            <AllTabContent data={all} />
          ) : tabId === 'function' ? (
            <FunctionsTabContent
              data={programs.sort((a, b) => b.date.localeCompare(a.date))}
            />
          ) : tabId === 'instance' ? (
            <InstancesTabContent
              data={instances.sort((a, b) => b.date.localeCompare(a.date))}
            />
          ) : tabId === 'website' ? (
            <WebsitesTabContent
              data={websites.sort((a, b) => b.date.localeCompare(a.date))}
            />
          ) : tabId === 'volume' ? (
            <VolumesTabContent
              data={volumes.sort((a, b) => b.date.localeCompare(a.date))}
            />
          ) : tabId === 'ssh' ? (
            <SSHKeysTabContent
              data={sshKeys.sort((a, b) => b.date.localeCompare(a.date))}
            />
          ) : tabId === 'domain' ? (
            <DomainsTabContent
              data={domains.sort((a, b) => b.date.localeCompare(a.date))}
            />
          ) : (
            <></>
          )}
        </div>
      </Container>
      <Container $variant="xl">
        <HoldTokenDisclaimer />
      </Container>
    </>
  )
}
