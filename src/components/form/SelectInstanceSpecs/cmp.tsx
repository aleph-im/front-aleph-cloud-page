import React from 'react'
/* eslint-disable @next/next/no-img-element */
import { useSelectInstanceSpecs } from '@/hooks/form/useSelectInstanceSpecs'
import { Button, Icon, TableColumn } from '@aleph-front/aleph-core'
import { useCallback, useMemo } from 'react'
import { convertBitUnits } from '@/helpers/utils'
import { SelectInstanceSpecsProps, SpecsDetail } from './types'
import { StyledTable } from './styles'
import { Executable } from '@/domain/executable'
import { EntityType } from '@/helpers/constants'

export const SelectInstanceSpecs = React.memo(
  (props: SelectInstanceSpecsProps) => {
    const { type, specs, options, isPersistent, handleChange } =
      useSelectInstanceSpecs(props)

    const columns = useMemo(() => {
      const cols = [
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
      ] as TableColumn<SpecsDetail>[]

      if (type === EntityType.Instance) {
        cols.splice(2, 0, {
          label: 'Storage',
          align: 'right',
          sortable: true,
          sortBy: (row: SpecsDetail) => row.storage,
          render: (row: SpecsDetail) => {
            const isActive = specs?.id === row.specs.id
            const className = `${isActive ? 'text-main0' : ''}`
            return <span className={className}>{row.storage}</span>
          },
        },)
      }

      return cols
    }, [specs, type])

    const data: SpecsDetail[] = useMemo(() => {
      return options.map((specs) => {
        const { ram, storage } = specs
        const price = Executable.getExecutableCost({
          type,
          specs,
          isPersistent,
        })

        return {
          specs,
          storage: convertBitUnits(storage, {
            from: 'mb',
            to: 'gb',
            displayUnit: true,
          }) as string,
          ram: convertBitUnits(ram, {
            from: 'mb',
            to: 'gb',
            displayUnit: true,
          }) as string,
          price: price.computeTotalCost + ' ALEPH',
        }
      })
    }, [type, isPersistent, options])

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
  },
)
SelectInstanceSpecs.displayName = 'SelectInstanceSpecs'

export default SelectInstanceSpecs
