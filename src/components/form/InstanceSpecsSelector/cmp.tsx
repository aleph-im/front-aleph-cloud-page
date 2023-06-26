/* eslint-disable @next/next/no-img-element */
import styled, { css } from 'styled-components'
import {
  InstanceSpecs,
  useInstanceSpecsSelector,
} from '@/hooks/form/useInstanceSpecsSelector'
import { Button, Icon, Table, TableColumn } from '@aleph-front/aleph-core'
import { useCallback, useMemo } from 'react'
import { convertBitUnits, getFunctionCost } from '@/helpers/utils'

export type InstanceSpecsSelectorProps = {
  specs?: InstanceSpecs
  options?: InstanceSpecs[]
  isPersistentStorage?: boolean
  onChange: (specs: InstanceSpecs) => void
}

export type SpecsDetail = {
  specs: InstanceSpecs
  ram: string // in GB
  price: string // in ALEPH
}

const StyledTable = styled(Table<SpecsDetail>)`
  ${({ theme }) => css`
    tbody {
      tr {
        cursor: pointer;
        &:hover {
          color: ${theme.color.main0};
        }
      }
    }
  `}
`

// Mocked specs
export default function InstanceSpecsSelector({
  specs: specsProp,
  options: optionsProp,
  isPersistentStorage = false,
  onChange,
}: InstanceSpecsSelectorProps) {
  const { specs, options, handleChange } = useInstanceSpecsSelector({
    specs: specsProp,
    options: optionsProp,
    onChange,
  })

  const columns = useMemo(
    () =>
      [
        {
          label: 'Cores',
          sortable: true,
          sortBy: (row: SpecsDetail) => row.specs.cpu,
          render: (row: SpecsDetail) => {
            const isActive = specs?.id === row.specs.id
            const className = `${isActive ? 'text-main0' : ''} tp-body2`
            return <span className={className}>{row.specs.cpu} x86 64bit</span>
          },
        },
        {
          label: 'Memory',
          align: 'right',
          sortable: true,
          sortBy: (row: SpecsDetail) => row.ram,
          render: (row: SpecsDetail) => {
            const isActive = specs?.id === row.specs.id
            const className = `${isActive ? 'text-main0' : ''}`
            return <span className={className}>{row.ram}</span>
          },
        },
        {
          label: 'Hold',
          align: 'right',
          sortable: true,
          sortBy: (row: SpecsDetail) => row.price,
          render: (row: SpecsDetail) => {
            const isActive = specs?.id === row.specs.id
            const className = `${isActive ? 'text-main0' : ''}`
            return <span className={className}>{row.price}</span>
          },
        },
        {
          label: '',
          align: 'right',
          render: (row: SpecsDetail) => {
            const active = specs?.id === row.specs.id

            return (
              <Button
                color="main0"
                variant="tertiary"
                kind="neon"
                size="regular"
                forwardedAs="button"
                type="button"
                // TODO: Fix this
                style={{ visibility: active ? 'visible' : 'hidden' }}
                onClick={(e) => e.preventDefault()}
              >
                <Icon name="check" />
              </Button>
            )
          },
        },
      ] as TableColumn<SpecsDetail>[],
    [specs],
  )

  const data: SpecsDetail[] = useMemo(() => {
    return options.map((specs) => {
      const { cpu, ram } = specs
      const price = getFunctionCost({ cpu, isPersistentStorage })

      return {
        specs,
        ram: convertBitUnits(ram, {
          from: 'mb',
          to: 'gb',
          displayUnit: true,
        }) as string,
        price: price.compute + ' ALEPH',
      }
    })
  }, [isPersistentStorage, options])

  const handleRowKey = useCallback((row: SpecsDetail) => row.specs.id, [])

  const handleRowProps = useCallback(
    (row: SpecsDetail) => ({ onClick: () => handleChange(row.specs) }),
    [handleChange],
  )

  return (
    <div tw="max-w-full overflow-y-hidden overflow-x-auto">
      <StyledTable
        borderType="none"
        oddRowNoise
        rowKey={handleRowKey}
        rowProps={handleRowProps}
        columns={columns}
        data={data}
      />
    </div>
  )
}
