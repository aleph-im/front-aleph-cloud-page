import { KeyboardEvent, useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
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
import { humanReadableSize } from '@/helpers/utils'
import ButtonLink from '@/components/common/ButtonLink'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import Price from '@/components/common/Price'
import FloatingFooter from '@/components/form/FloatingFooter'
import { PageProps } from '@/types/types'
import { CRNItem } from './types'

export default function NewInstanceCRNListPage({ mainRef }: PageProps) {
  const { nodes, lastVersion, specs, ips } = useNewInstanceCRNListPage()

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
          return (
            <div tw="flex gap-3 justify-end">
              {node.isLoading ? (
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
                  <Button
                    color="main0"
                    variant="tertiary"
                    kind="default"
                    size="md"
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    tabIndex={-1}
                    className="check-button"
                    style={{
                      visibility: node.isActive ? 'visible' : 'hidden',
                      opacity: node.isActive ? '1' : '0',
                      transition: 'all ease-in-out 500ms 0ms',
                      transitionProperty: 'opacity visibility',
                    }}
                  >
                    <Icon name="check" size="lg" />
                  </Button>
                </>
              )}
            </div>
          )
        },
      },
    ] as TableColumn<CRNItem>[]
  }, [specs, lastVersion, theme])

  const [selected, setSelected] = useState<string>()

  const data: CRNItem[] = useMemo(() => {
    if (!nodes) return []

    return nodes.map((node) => {
      const { hash } = node

      const isActive = hash === selected

      const nodeSpecs = specs[hash]
      const nodeIps = ips[hash]
      const isLoading = !nodeSpecs || !nodeIps

      return {
        ...node,
        isActive,
        isLoading,
      }
    })
  }, [ips, nodes, selected, specs])

  const handleRowProps = useCallback(
    (row: CRNItem) => ({
      tabIndex: row.disabled ? -1 : 0,
      className: `${row.disabled ? '_disabled' : ''} ${
        row.isActive ? '_active' : ''
      } ${row.isLoading ? '_loading' : ''}`,
      onClick: () => {
        if (row.disabled) return
        if (row.isLoading) return

        setSelected(row.hash)
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.code !== 'Space' && e.code !== 'Enter') return
        if (row.disabled) return
        if (row.isLoading) return

        e.preventDefault()
        setSelected(row.hash)
      },
    }),
    [],
  )

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
            <NodesTable
              columns={columns}
              data={data}
              rowProps={handleRowProps}
            />
          </NoisyContainer>
        </Container>
      </section>
      <FloatingFooter containerRef={mainRef} shouldHide={false}>
        <div tw="py-6 text-center">
          <ButtonLink
            type="button"
            color="main0"
            kind="default"
            size="md"
            variant="primary"
            href={`./crn/${selected}`}
            disabled={!selected}
          >
            Proceed to configuration
          </ButtonLink>
        </div>
      </FloatingFooter>
    </>
  )
}
