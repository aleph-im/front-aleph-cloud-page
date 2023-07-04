import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { Table, Tabs } from '@aleph-front/aleph-core'
import ButtonLink from '@/components/ButtonLink'
import {
  AnyProduct,
  convertBitUnits,
  ellipseAddress,
  humanReadableSize,
  isVolume,
  isVolumePersistent,
  unixToISODateString,
} from '@/helpers/utils'
import { ProgramMessage } from 'aleph-sdk-ts/dist/messages/types'
import { useDashboardHomePage } from '@/hooks/pages/useDashboardHomePage'
import {
  ImmutableVolume,
  PersistentVolume,
} from 'aleph-sdk-ts/dist/messages/types'
import { SSHKey } from '@/helpers/ssh'
import CenteredContainer from '@/components/CenteredContainer'

const Container = styled(CenteredContainer).attrs((props) => ({
  ...props,
  variant: 'dashboard',
}))``

const TabContent = ({
  data,
  fileStats,
}: {
  data: AnyProduct[]
  fileStats: any
}) => {
  const getVolumeSize = useCallback(
    (hash: string) => {
      const size = fileStats.find((s: any) => s.item_hash === hash)?.size || 0
      return size / 1024
    },
    [fileStats],
  )

  const flattenedSizeData: ProgramMessage[] = useMemo(
    () =>
      data.map((product) => {
        if (!('type' in product)) return product

        if (isVolume(product)) {
          return {
            ...product,
            size: getVolumeSize(product.item_hash),
          }
        }
        return {
          ...product,
          size: (product as ProgramMessage).content?.volumes.reduce(
            (ac, cv) => {
              if (isVolumePersistent(cv)) {
                const persistentVolume = (cv as PersistentVolume)?.size_mib
                return ac + persistentVolume * 10 ** 3
              }
              return (ac += getVolumeSize((cv as ImmutableVolume).ref))
            },
            0,
          ),
        }
      }) as ProgramMessage[],
    [data, getVolumeSize],
  )

  return (
    <div tw="overflow-auto max-w-full">
      <Table
        borderType="none"
        oddRowNoise
        rowKey={(row: ProgramMessage) => row?.item_hash}
        data={flattenedSizeData}
        columns={[
          {
            label: 'Type',
            render: (row: ProgramMessage) =>
              isVolume(row) ? 'Volume' : 'Function',
            sortable: true,
          },
          {
            label: 'Name',
            render: (row: ProgramMessage) =>
              row?.content?.metadata?.name ||
              ellipseAddress(row?.item_hash || ''),
            sortable: true,
          },
          {
            label: 'Cores',
            align: 'right',
            render: (row: ProgramMessage) =>
              isVolume(row) ? '-' : row?.content?.resources?.vcpus || 0,
            sortable: true,
          },
          {
            label: 'Memory',
            align: 'right',
            render: (row: ProgramMessage) =>
              isVolume(row)
                ? '-'
                : convertBitUnits(row?.content?.resources?.memory || 0, {
                    from: 'mb',
                    to: 'gb',
                  }),
            sortable: true,
          },
          {
            label: 'Size',
            align: 'right',
            render: (row: ProgramMessage) => humanReadableSize(row.size),
            sortable: true,
          },
          {
            label: 'Date',
            align: 'right',
            render: (row: ProgramMessage) =>
              unixToISODateString(row?.content?.time),
            sortable: true,
          },
          {
            label: '',
            align: 'right',
            render: (row: ProgramMessage) => (
              <ButtonLink href={`/dashboard/manage?hash=${row?.item_hash}`}>
                &gt;
              </ButtonLink>
            ),
          },
        ]}
      />
    </div>
  )
}

const SSHKeysTabContent = ({ data }: { data: SSHKey[] }) => {
  return (
    <div tw="overflow-auto max-w-full">
      <Table
        borderType="none"
        oddRowNoise
        rowKey={(row) => row.key}
        data={data}
        columns={[
          {
            label: 'SSH Key',
            sortable: true,
            width: '75%',
            render: (row) => row.key,
            cellProps: () => ({
              css: tw`max-w-0 whitespace-nowrap overflow-hidden text-ellipsis pr-3!`,
            }),
          },
          {
            label: 'Label',
            sortable: true,
            render: (row) => row.label || '',
            cellProps: () => ({
              css: tw`max-w-0 whitespace-nowrap overflow-hidden text-ellipsis px-3!`,
            }),
          },
          {
            label: '',
            width: '0',
            align: 'right',
            render: (row: SSHKey) => (
              <ButtonLink href={`/dashboard/manage?hash=${row.id}`}>
                &gt;
              </ButtonLink>
            ),
            cellProps: () => ({
              css: tw`pl-3!`,
            }),
          },
        ]}
      />
    </div>
  )
}

export default function DashboardHome() {
  const { all, functions, instances, volumes, fileStats, sshKeys } =
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
                label: `(${all.length || 0})`,
                labelPosition: 'bottom',
              },
              {
                id: 'function',
                name: 'Functions',
                label: `(${functions?.length || 0})`,
                labelPosition: 'bottom',
              },
              {
                id: 'instance',
                name: 'Instances',
                label: `(${instances?.length || 0})`,
                labelPosition: 'bottom',
              },
              {
                id: 'volume',
                name: 'Immutable Volumes',
                label: `(${volumes?.length || 0})`,
                labelPosition: 'bottom',
              },
              {
                id: 'ssh',
                name: 'SSH Keys',
                label: `(${sshKeys?.length || 0})`,
                labelPosition: 'bottom',
              },
            ]}
            onTabChange={setTabId}
          />
        </div>
        <div role="tabpanel">
          {tabId === 'all' ? (
            <>
              {all.length > 0 ? (
                <TabContent fileStats={fileStats} data={all} />
              ) : (
                <div tw="mt-10 text-center">
                  <ButtonLink variant="primary" href="/dashboard/function">
                    Create your first function
                  </ButtonLink>
                </div>
              )}
            </>
          ) : tabId === 'function' ? (
            <>
              {functions.length > 0 ? (
                <>
                  <TabContent fileStats={fileStats} data={functions} />
                  <div tw="mt-20 text-center">
                    <ButtonLink variant="primary" href="/dashboard/function">
                      Create function
                    </ButtonLink>
                  </div>
                </>
              ) : (
                <div tw="mt-10 text-center">
                  <ButtonLink variant="primary" href="/dashboard/function">
                    Create your first function
                  </ButtonLink>
                </div>
              )}
            </>
          ) : tabId === 'instance' ? (
            <>
              {instances.length > 0 ? (
                <>
                  <TabContent fileStats={fileStats} data={instances} />
                  <div tw="mt-20 text-center">
                    <ButtonLink variant="primary" href="/dashboard/instance">
                      Create instance
                    </ButtonLink>
                  </div>
                </>
              ) : (
                <div tw="mt-10 text-center">
                  <ButtonLink variant="primary" href="/dashboard/instance">
                    Create your first instance
                  </ButtonLink>
                </div>
              )}
            </>
          ) : tabId === 'volume' ? (
            <>
              {volumes.length > 0 ? (
                <>
                  <TabContent fileStats={fileStats} data={volumes} />
                  <div tw="mt-20 text-center">
                    <ButtonLink variant="primary" href="/dashboard/volume">
                      Create volume
                    </ButtonLink>
                  </div>
                </>
              ) : (
                <div tw="mt-10 text-center">
                  <ButtonLink variant="primary" href="/dashboard/volume">
                    Create your first volume
                  </ButtonLink>
                </div>
              )}
            </>
          ) : tabId === 'ssh' ? (
            <>
              {sshKeys.length > 0 ? (
                <>
                  <SSHKeysTabContent data={sshKeys} />
                  <div tw="mt-20 text-center">
                    <ButtonLink variant="primary" href="/dashboard/ssh">
                      Create ssh key
                    </ButtonLink>
                  </div>
                </>
              ) : (
                <div tw="mt-10 text-center">
                  <ButtonLink variant="primary" href="/dashboard/ssh">
                    Create your first ssh key
                  </ButtonLink>
                </div>
              )}
            </>
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
