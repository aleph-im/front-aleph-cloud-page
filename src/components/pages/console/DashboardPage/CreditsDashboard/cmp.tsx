import React, { useState } from 'react'
import {
  Button,
  Icon,
  NoisyContainer,
  ObjectImg,
  TextGradient,
} from '@aleph-front/core'
import { SectionTitle } from '@/components/common/CompositeTitle'

import ToggleDashboard from '@/components/common/ToggleDashboard'
import StyledTable from '@/components/common/Table'
import ButtonLink from '@/components/common/ButtonLink'
import tw from 'twin.macro'

export default function CreditsDashboard() {
  const [creditsDashboardOpen, setCreditsDashboardOpen] = useState(true)

  const data = [
    {
      id: 1,
      status: 'finished',
      date: 1756121519678,
      amount: 100,
      asset: 'USDC',
      credits: 120,
    },
    {
      id: 2,
      status: 'ongoing',
      date: 1756121546481,
      amount: 80,
      asset: 'USDC',
      credits: 95,
    },
  ]

  return (
    <section tw="px-0 pb-6 pt-12 lg:pb-5">
      <SectionTitle>Credits</SectionTitle>
      <ToggleDashboard
        open={creditsDashboardOpen}
        setOpen={setCreditsDashboardOpen}
        toggleButton={{
          children: (
            <>
              Open credits <Icon name="credit-card" />
            </>
          ),
          disabled: false,
        }}
      >
        <div tw="flex flex-col gap-5">
          <NoisyContainer>
            <div tw="flex flex-wrap items-center justify-between gap-6">
              <div tw="flex flex-wrap gap-4 items-center">
                <ObjectImg id="Object20" color="main0" size={50} />

                <div tw="flex gap-3 items-center">
                  <div
                    className="bg-base1"
                    tw="flex flex-col items-start justify-between px-3 py-2 min-w-[6.875rem] min-h-[3.8125rem]"
                  >
                    <p className="tp-info text-base2">AVAILABLE</p>
                    <p className="text-main0 tp-h7">1080</p>
                  </div>
                  <div
                    className="bg-base1"
                    tw="flex flex-col items-start justify-between px-3 py-2 min-w-[6.875rem] min-h-[3.8125rem]"
                  >
                    <p className="tp-info text-base2">RUN-RATE</p>
                    <div tw="flex items-end gap-0.5">
                      <p className="text-main0 tp-h7">34</p>
                      <p className="text-main0 tp-info" tw="mb-1">
                        DAYS
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Button variant="secondary" kind="flat" tw="bg-white!" disabled>
                  Top-up Credits
                  <Icon name="credit-card" />
                </Button>
              </div>
            </div>
          </NoisyContainer>

          <div>
            <div tw="flex gap-6 items-center">
              <TextGradient as="h3" type="h7">
                Purchases
              </TextGradient>

              <Button variant="textOnly" size="sm" tw="mb-7!" disabled>
                History <Icon name="chevron-square-right" />
              </Button>
            </div>
            <StyledTable
              // borderType="none"
              rowNoise
              rowKey={(row) => row.id}
              data={data}
              columns={[
                {
                  label: 'STATUS',
                  align: 'left',
                  sortable: true,
                  render: (row) => row.status,
                },
                {
                  label: 'DATE',
                  align: 'left',
                  sortable: true,
                  render: (row) => row.date,
                },
                {
                  label: 'AMOUNT',
                  align: 'left',
                  sortable: true,
                  render: (row) => row.amount,
                },
                {
                  label: 'ASSET',
                  align: 'left',
                  sortable: true,
                  render: (row) => row.asset,
                },
                {
                  label: 'CREDITS',
                  align: 'left',
                  sortable: true,
                  render: (row) => `~${row.credits}`,
                },
                {
                  label: '',
                  width: '100%',
                  align: 'right',
                  render: (row) => (
                    <Button
                      kind="functional"
                      variant="textOnly"
                      href={`/console/computing/instance/${row.id}`}
                    >
                      <div
                        className="bg-base0"
                        tw="h-10 w-12 flex items-center justify-center"
                      >
                        <Icon name="ellipsis" size="lg" />
                      </div>
                    </Button>
                  ),
                  cellProps: () => ({
                    css: tw`pl-3!`,
                  }),
                },
              ]}
            />
          </div>
        </div>
      </ToggleDashboard>
    </section>
  )
}
