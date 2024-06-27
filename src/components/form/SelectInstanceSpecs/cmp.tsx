import React, { KeyboardEvent, memo, useEffect, useState } from 'react'
/* eslint-disable @next/next/no-img-element */
import { useSelectInstanceSpecs } from '@/hooks/form/useSelectInstanceSpecs'
import {
  Button,
  FormError,
  Icon,
  NoisyContainer,
  TableColumn,
  TextGradient,
} from '@aleph-front/core'
import { useCallback, useMemo } from 'react'
import { convertByteUnits } from '@/helpers/utils'
import { SelectInstanceSpecsProps, SpecsDetail } from './types'
import { ExecutableManager } from '@/domain/executable'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import Price from '@/components/common/Price'
import Table from '@/components/common/Table'

export const SelectInstanceSpecs = memo((props: SelectInstanceSpecsProps) => {
  const { specsCtrl, options, type, isPersistent, paymentMethod } =
    useSelectInstanceSpecs(props)

  const columns = useMemo(() => {
    const cols = [
      {
        label: 'Cores',
        sortable: true,
        sortBy: (row: SpecsDetail) => row.specs.cpu,
        render: (row: SpecsDetail) => `${row.specs.cpu} x86 64bit`,
      },
      {
        label: 'RAM',
        align: 'right',
        sortable: true,
        sortBy: (row: SpecsDetail) => row.ram,
        render: (row: SpecsDetail) => row.ram,
      },
      {
        label: 'Price',
        align: 'right',
        sortable: true,
        sortBy: (row: SpecsDetail) => row.price,
        render: (row: SpecsDetail) => (
          <span tw="flex items-center justify-end gap-1">
            <Price
              value={row.price}
              duration={paymentMethod === PaymentMethod.Hold ? undefined : 'h'}
            />
          </span>
        ),
      },
      {
        label: '',
        width: '25%',
        align: 'right',
        render: (row: SpecsDetail) => {
          return (
            <>
              {row.specs.disabled ? (
                <div
                  className="fs-12 tp-body2"
                  tw="inline-block text-center py-2 px-4"
                >
                  (Soon)
                </div>
              ) : (
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
                    visibility: row.isActive ? 'visible' : 'hidden',
                    opacity: row.isActive ? '1' : '0',
                    transition: 'all ease-in-out 500ms 0ms',
                    transitionProperty: 'opacity visibility',
                  }}
                >
                  <Icon name="check" size="lg" />
                </Button>
              )}
            </>
          )
        },
      },
    ] as TableColumn<SpecsDetail>[]

    if (type === EntityType.Instance) {
      cols.splice(2, 0, {
        label: 'HDD',
        align: 'right',
        sortable: true,
        sortBy: (row: SpecsDetail) => row.storage,
        render: (row: SpecsDetail) => {
          return <span>{row.storage}</span>
        },
      })
    }

    return cols
  }, [paymentMethod, type])

  // ------------------------------------------

  const [prices, setPrices] = useState<number[]>([])
  const { cpu } = specsCtrl.field.value

  useEffect(() => {
    async function load(): Promise<void> {
      const loadedData = await Promise.all(
        options.map(async (specs) => {
          const { computeTotalCost } =
            await ExecutableManager.getExecutableCost({
              type,
              specs,
              isPersistent,
              paymentMethod,
            })

          return computeTotalCost
        }),
      )

      setPrices(loadedData)
    }

    load()
  }, [isPersistent, options, paymentMethod, type])

  const data = useMemo(() => {
    return options.map((specs, i) => {
      const { storage, ram } = specs
      const isActive = cpu === specs.cpu

      return {
        specs,
        isActive,
        storage: convertByteUnits(storage, {
          from: 'MiB',
          to: 'GiB',
          displayUnit: true,
        }),
        ram: convertByteUnits(ram, {
          from: 'MiB',
          to: 'GiB',
          displayUnit: true,
        }),
        price: prices[i],
      }
    })
  }, [cpu, options, prices])

  const getRowKey = useCallback((row: SpecsDetail) => row.specs.cpu + '', [])

  const { onChange, ref } = specsCtrl.field

  const handleRowProps = useCallback(
    (row: SpecsDetail, rowIndex: number) => ({
      tabIndex: row.specs.disabled ? -1 : 0,
      className: `${row.specs.disabled ? '_disabled' : ''} ${
        row.isActive ? '_active' : ''
      }`,
      ref: rowIndex === 0 ? ref : undefined,
      onClick: () => {
        if (row.specs.disabled) return
        onChange(row.specs)
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.code !== 'Space' && e.code !== 'Enter') return
        if (row.specs.disabled) return

        e.preventDefault()
        onChange(row.specs)
      },
    }),
    [onChange, ref],
  )

  return (
    <NoisyContainer>
      <TextGradient forwardedAs="h3" type="h7" tw="mb-6">
        Available resources
      </TextGradient>
      <div tw="max-w-full overflow-y-hidden overflow-x-auto">
        <Table
          borderType="none"
          rowNoise
          rowKey={getRowKey}
          rowProps={handleRowProps}
          columns={columns}
          data={data}
        />
        {specsCtrl.fieldState.error && (
          <FormError error={specsCtrl.fieldState.error} />
        )}
      </div>
      {props.children}
    </NoisyContainer>
  )
})
SelectInstanceSpecs.displayName = 'SelectInstanceSpecs'

export default SelectInstanceSpecs
