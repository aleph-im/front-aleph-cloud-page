import { useMemo } from 'react'
import {
  Button,
  Icon,
  Logo,
  NodeName,
  NodeScore,
  NodeVersion,
  TableColumn,
} from '@aleph-front/core'
import { apiServer } from '@/helpers/constants'
import Container from '@/components/common/CenteredContainer'
import { useNewInstanceStreamNodesPage } from '@/hooks/pages/computing/useNewInstanceStreamNodesPage'
import NewEntityTab from '../NewEntityTab'
import NodesTable from '@/components/common/NodesTable'
import Image from 'next/image'
import { CRN } from '@/domain/node'
import { humanReadableSize } from '@/helpers/utils'
import ButtonLink from '@/components/common/ButtonLink'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import { validateMinNodeSpecs } from '@/hooks/form/useSelectInstanceSpecs'

export default function NewInstanceStreamNodesPage() {
  const { nodes, lastVersion, specs, minSpecs } =
    useNewInstanceStreamNodesPage()

  const theme = useTheme()

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
          <div tw="flex items-center gap-1 whitespace-nowrap">
            0.12 <Logo text={false} color="main0" /> / h
          </div>
        ),
      },
      {
        label: '',
        align: 'right',
        render: (node) => {
          const nodeSpecs = specs[node.hash]
          const isLoading = !nodeSpecs
          const isValid =
            nodeSpecs?.data && validateMinNodeSpecs(minSpecs, nodeSpecs.data)

          return (
            <div tw="flex gap-3 justify-end">
              {isLoading ? (
                <Button
                  kind="neon"
                  size="regular"
                  variant="secondary"
                  color="main2"
                  disabled
                  tw="w-16!"
                >
                  <RotatingLines strokeColor={theme.color.main2} width="1em" />
                </Button>
              ) : (
                <>
                  {!isValid ? (
                    <Button
                      kind="neon"
                      size="regular"
                      variant="secondary"
                      color="error"
                      disabled
                      tw="w-16!"
                    >
                      <Icon name="exclamation" color="error" />
                    </Button>
                  ) : (
                    <ButtonLink
                      kind="neon"
                      size="regular"
                      variant="secondary"
                      color="main0"
                      href={`./stream/${node.hash}`}
                      tw="w-16!"
                    >
                      <Icon name="angle-right" />
                    </ButtonLink>
                  )}
                </>
              )}
            </div>
          )
        },
      },
    ] as TableColumn<CRN>[]
  }, [specs, lastVersion, minSpecs, theme])

  return (
    <>
      <section tw="px-0 py-0 md:py-8">
        <Container>
          <NewEntityTab selected="instance" />
        </Container>
      </section>
      <section tw="relative px-0 pt-20 pb-6 md:py-10">
        <SpinnerOverlay show={!nodes} />
        <Container variant="dashboard">
          <NodesTable columns={columns} data={nodes || []} />
        </Container>
      </section>
    </>
  )
}
