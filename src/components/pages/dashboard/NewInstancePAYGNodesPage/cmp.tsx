import { useMemo } from 'react'
import {
  Icon,
  Logo,
  NodeName,
  NodeScore,
  NodeVersion,
  TableColumn,
} from '@aleph-front/aleph-core'
import { apiServer } from '@/helpers/constants'
import Container from '@/components/common/CenteredContainer'
import { useNewInstancePAYGNodesPage } from '@/hooks/pages/dashboard/useNewInstancePAYGNodesPage'
import NewEntityTab from '../NewEntityTab'
import NodesTable from '@/components/common/NodesTable'
import Image from 'next/image'
import { CRN } from '@/domain/node'
import { humanReadableSize } from '@/helpers/utils'
import ButtonLink from '@/components/common/ButtonLink'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'

export default function NewInstancePAYGNodesPage() {
  const { nodes, lastVersion, specs } = useNewInstancePAYGNodesPage()

  const columns = useMemo(() => {
    return [
      {
        label: 'SCORE',
        sortable: true,
        sortBy: (node) => node.score,
        render: (node) => <NodeScore score={node.score} />,
      },
      {
        label: 'NAME',
        sortable: true,
        sortBy: (node) => node.name,
        render: (node) => (
          <NodeName
            hash={node.hash}
            name={node.name}
            picture={node.picture}
            ImageCmp={Image}
            apiServer={apiServer}
          />
        ),
      },
      {
        label: 'CPU',
        sortable: true,
        sortBy: (node) => specs?.[node.hash]?.cpu.count || 0,
        render: (node) => (
          <div tw="whitespace-nowrap">
            {specs?.[node.hash] ? (
              <>{specs[node.hash].cpu.count} x86 64bit</>
            ) : (
              '-'
            )}
          </div>
        ),
      },
      {
        label: 'RAM',
        sortable: true,
        sortBy: (node) => specs?.[node.hash]?.mem.available_kB || 0,
        render: (node) => (
          <div tw="whitespace-nowrap">
            {specs?.[node.hash]
              ? humanReadableSize(specs[node.hash].mem.available_kB, 'KiB')
              : '-'}
          </div>
        ),
      },
      {
        label: 'HDD',
        sortable: true,
        sortBy: (node) => specs?.[node.hash]?.disk.available_kB || 0,
        render: (node) => (
          <div tw="whitespace-nowrap">
            {specs?.[node.hash]
              ? humanReadableSize(specs[node.hash].disk.available_kB, 'KiB')
              : '-'}
          </div>
        ),
      },
      {
        label: 'VERSION',
        sortable: true,
        sortBy: (node) => node.metricsData?.version,
        render: (node) => (
          <NodeVersion
            version={node.metricsData?.version || ''}
            lastVersion={lastVersion}
          />
        ),
      },
      {
        label: 'PRICE',
        sortable: true,
        sortBy: () => 0.11,
        render: () => (
          <div tw="flex items-center gap-2 whitespace-nowrap">
            0.11 <Logo color="main0" text="" /> / h
          </div>
        ),
      },
      {
        label: '',
        align: 'right',
        render: (node) => (
          <div tw="flex gap-3 justify-end">
            <ButtonLink
              kind="neon"
              size="regular"
              variant="secondary"
              color="main0"
              href={`./payg/${node.hash}`}
            >
              <Icon name="angle-right" />
            </ButtonLink>
          </div>
        ),
      },
    ] as TableColumn<CRN>[]
  }, [lastVersion, specs])

  return (
    <>
      <section tw="px-0 py-0 md:py-8">
        <Container>
          <NewEntityTab selected="instance" />
        </Container>
      </section>
      <section tw="relative px-0 pt-20 pb-6 md:py-10">
        <SpinnerOverlay show={!nodes || !specs} />
        <Container variant="dashboard">
          <NodesTable columns={columns} data={nodes || []} />
        </Container>
      </section>
    </>
  )
}
