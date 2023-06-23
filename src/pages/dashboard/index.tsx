import { Col, Row, Table, Tabs } from '@aleph-front/aleph-core'
import ButtonLink from '@/components/ButtonLink'
import BaseContainer from '@/components/Container'
import {
  convertBitUnits,
  ellipseAddress,
  ellipseText,
  humanReadableSize,
  isVolume,
  isVolumePersistent,
  unixToISODateString,
} from '@/helpers/utils'
import {
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/message'
import { useDashboardHomePage } from '@/hooks/pages/useDashboardHomePage'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import {
  ImmutableVolume,
  PersistentVolume,
} from 'aleph-sdk-ts/dist/messages/program/programModel'
import { SSHKey } from '@/helpers/ssh'

const Container = ({ children }: { children: ReactNode }) => (
  <Row xs={1} lg={12} gap="0">
    <Col xs={1} lg={12} xl={8} xlOffset={3}>
      <BaseContainer>
        <div tw="max-w-[961px] mx-auto">{children}</div>
      </BaseContainer>
    </Col>
  </Row>
)

const TabContent = ({
  data,
  fileStats,
}: {
  data: (ProgramMessage | StoreMessage)[]
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
        if (!product?.type) return product

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
            render: (row) => ellipseText(row.key, 20, 0),
            sortable: true,
          },
          {
            label: 'Label',
            render: (row) => row.label || '',
            sortable: true,
          },
          {
            label: '',
            align: 'right',
            render: (row: SSHKey) => (
              <ButtonLink href={`/dashboard/manage?hash=${row.id}`}>
                &gt;
              </ButtonLink>
            ),
          },
        ]}
      />
    </div>
  )
}

export default function DashboardHome() {
  const { products, functions, volumes, fileStats, sshKeys } =
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
                label: `(${products.length || 0})`,
                labelPosition: 'bottom',
              },
              {
                id: 'function',
                name: 'Functions',
                label: `(${functions?.length || 0})`,
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
              {products.length > 0 ? (
                <TabContent fileStats={fileStats} data={products} />
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
