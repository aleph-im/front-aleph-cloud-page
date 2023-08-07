import React, { KeyboardEvent, memo } from 'react'
/* eslint-disable @next/next/no-img-element */
import { useSelectInstanceSpecs } from '@/hooks/form/useSelectInstanceSpecs'
import { Button, FormError, Icon, TableColumn } from '@aleph-front/aleph-core'
import { useCallback, useMemo } from 'react'
import { convertBitUnits } from '@/helpers/utils'
import { SelectInstanceSpecsProps, SpecsDetail } from './types'
import { StyledTable } from './styles'
import { Executable } from '@/domain/executable'
import { EntityType } from '@/helpers/constants'

export const SelectInstanceSpecs = memo((props: SelectInstanceSpecsProps) => {
  const { specsCtrl, options, type, isPersistent } =
    useSelectInstanceSpecs(props)

  const columns = useMemo(() => {
    const cols = [
      {
        label: 'Cores',
        sortable: true,
        sortBy: (row: SpecsDetail) => row.specs.cpu,
        render: (row: SpecsDetail) => (
          <span className={row.className}>{row.specs.cpu} x86 64bit</span>
        ),
      },
      {
        label: 'Memory',
        align: 'right',
        sortable: true,
        sortBy: (row: SpecsDetail) => row.ram,
        render: (row: SpecsDetail) => (
          <span className={row.className}>{row.ram}</span>
        ),
      },
      {
        label: 'Hold',
        align: 'right',
        sortable: true,
        sortBy: (row: SpecsDetail) => row.price,
        render: (row: SpecsDetail) => (
          <span className={row.className}>{row.price}</span>
        ),
      },
      {
        label: '',
        align: 'right',
        render: (row: SpecsDetail) => {
          return (
            <Button
              color="main0"
              variant="tertiary"
              kind="neon"
              size="regular"
              forwardedAs="button"
              type="button"
              tabIndex={-1}
              // TODO: Fix this
              style={{ visibility: row.isActive ? 'visible' : 'hidden' }}
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
          return <span className={row.className}>{row.storage}</span>
        },
      })
    }

    return cols
  }, [type])

  const data: SpecsDetail[] = useMemo(() => {
    return options.map((specs) => {
      const { ram, storage } = specs
      const price = Executable.getExecutableCost({
        type,
        specs,
        isPersistent,
      })

      const isActive = specsCtrl.field.value.cpu === specs.cpu
      const className = `${isActive ? 'text-main0' : ''}`

      return {
        specs,
        isActive,
        className,
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
  }, [options, type, isPersistent, specsCtrl.field.value])

  const getRowKey = useCallback((row: SpecsDetail) => row.specs.cpu + '', [])

  const { onChange, ref } = specsCtrl.field

  const handleRowProps = useCallback(
    (row: SpecsDetail, rowIndex: number) => ({
      onClick: () => onChange(row.specs),
      onKeyDown: (e: KeyboardEvent) => {
        if (e.code !== 'Space' && e.code !== 'Enter') return
        e.preventDefault()
        onChange(row.specs)
      },
      tabIndex: 0,
      ref: rowIndex === 0 ? ref : undefined,
    }),
    [onChange, ref],
  )

  return (
    <div tw="max-w-full overflow-y-hidden overflow-x-auto">
      <StyledTable
        borderType="none"
        oddRowNoise
        rowKey={getRowKey}
        rowProps={handleRowProps}
        columns={columns}
        data={data}
      />
      {specsCtrl.fieldState.error && (
        <FormError error={specsCtrl.fieldState.error} />
      )}
    </div>
  )
})
SelectInstanceSpecs.displayName = 'SelectInstanceSpecs'

export default SelectInstanceSpecs
