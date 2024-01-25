import { useMemo } from 'react'
import {
  Button,
  Icon,
  NodeName,
  NodeScore,
  NodeVersion,
  NoisyContainer,
  TableColumn,
} from '@aleph-front/core'
import { apiServer } from '@/helpers/constants'
import Container from '@/components/common/CenteredContainer'
import { useNewInstanceCRNListPage } from '@/hooks/pages/computing/useNewInstanceCRNListPage'
import NewEntityTab from '../NewEntityTab'
import NodesTable from '@/components/common/NodesTable'
import Image from 'next/image'
import { CRN } from '@/domain/node'
import { humanReadableSize } from '@/helpers/utils'
import ButtonLink from '@/components/common/ButtonLink'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import Price from '@/components/common/Price'

export default function NewInstanceCRNListPage() {
  const { nodes, lastVersion, specs, minSpecs, ips } =
    useNewInstanceCRNListPage()

  const theme = useTheme()

  const columns = useMemo(() => {
    return [
      {
        label: 'SCORE',
        width: '10%',
        sortable: true,
        sortBy: (node) => node.score,
        render: (node) => <NodeScore score={node.score} />,
      },
      {
        label: 'NAME',
        width: '20%',
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
        width: '10%',
        sortable: true,
        sortBy: (node) => specs[node.hash]?.data?.cpu.count || 0,
        render: (node) => (
          <div tw="whitespace-nowrap">
            {specs[node.hash]?.data
              ? `${specs[node.hash]?.data?.cpu.count} x86 64bit`
              : 'n/a'}
          </div>
        ),
      },
      {
        label: 'RAM',
        width: '10%',
        sortable: true,
        sortBy: (node) => specs[node.hash]?.data?.mem.available_kB || 0,
        render: (node) => (
          <div tw="whitespace-nowrap">
            {humanReadableSize(specs[node.hash]?.data?.mem.available_kB, 'KiB')}
          </div>
        ),
      },
      {
        label: 'HDD',
        width: '10%',
        sortable: true,
        sortBy: (node) => specs[node.hash]?.data?.disk.available_kB || 0,
        render: (node) => (
          <div tw="whitespace-nowrap">
            {humanReadableSize(
              specs[node.hash]?.data?.disk.available_kB,
              'KiB',
            )}
          </div>
        ),
      },
      {
        label: 'VERSION',
        width: '20%',
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
        width: '20%',
        sortable: true,
        sortBy: () => 0.11,
        render: () => (
          <div tw="flex items-center gap-1 whitespace-nowrap">
            <Price value={0.11} /> per unit / h
          </div>
        ),
      },
      {
        label: '',
        align: 'right',
        width: '100%',
        render: (node) => {
          const nodeSpecs = specs[node.hash]
          const nodeIps = ips[node.hash]
          const isLoading = !nodeSpecs || !nodeIps

          return (
            <div tw="flex gap-3 justify-end">
              {isLoading ? (
                <Button
                  size="md"
                  color="main2"
                  tw="w-16!"
                  className="check-button"
                  disabled
                >
                  <RotatingLines strokeColor={theme.color.main0} width="1em" />
                </Button>
              ) : (
                <>
                  <ButtonLink
                    size="md"
                    color="main0"
                    tw="w-16!"
                    className="check-button"
                    href={`./crn/${node.hash}`}
                  >
                    <Icon name="angle-right" />
                  </ButtonLink>
                </>
              )}
            </div>
          )
        },
      },
    ] as TableColumn<CRN>[]
  }, [specs, lastVersion, ips, minSpecs, theme])

  return (
    <>
      <section tw="px-0 py-0 md:py-8">
        <Container>
          <NewEntityTab selected="instance" />
        </Container>
      </section>
      <section tw="relative px-0 pt-20 pb-6 md:py-10">
        <SpinnerOverlay show={!nodes} />
        <Container $variant="xl">
          <NoisyContainer>
            <NodesTable columns={columns} data={nodes || []} />
          </NoisyContainer>
        </Container>
      </section>
    </>
  )
}
