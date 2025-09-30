import React from 'react'
import {
  Button,
  Icon,
  NoisyContainer,
  ObjectImg,
  TextGradient,
} from '@aleph-front/core'
import { SectionTitle } from '@/components/common/CompositeTitle'

import ToggleDashboard from '@/components/common/ToggleDashboard'
import Skeleton from '@/components/common/Skeleton'
import { useCreditsDashboard } from './hook'

export default function CreditsDashboard() {
  const {
    runRateDays,
    creditsDashboardOpen,
    setCreditsDashboardOpen,
    isConnected,
    accountCreditBalance,
    isCalculatingCosts,
  } = useCreditsDashboard()

  // const data = [
  //   {
  //     id: 1,
  //     status: 'finished',
  //     date: 1756121519678,
  //     amount: 100,
  //     asset: 'USDC',
  //     credits: 120,
  //   },
  //   {
  //     id: 2,
  //     status: 'ongoing',
  //     date: 1756121546481,
  //     amount: 80,
  //     asset: 'USDC',
  //     credits: 95,
  //   },
  // ]

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
          disabled: !isConnected,
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
                    {accountCreditBalance !== undefined ? (
                      <p className="text-main0 tp-h7">{accountCreditBalance}</p>
                    ) : (
                      <Skeleton width="3rem" height="1.5rem" />
                    )}
                  </div>
                  <div
                    className="bg-base1"
                    tw="flex flex-col items-start justify-between px-3 py-2 min-w-[6.875rem] min-h-[3.8125rem]"
                  >
                    <p className="tp-info text-base2">RUN-RATE</p>
                    {isCalculatingCosts ? (
                      <Skeleton width="4rem" height="1.5rem" />
                    ) : (
                      <div tw="flex items-end gap-0.5">
                        <p className="text-main0 tp-h7">{runRateDays || '∞'}</p>
                        <p className="text-main0 tp-info" tw="mb-1 ml-1">
                          {runRateDays === 1 ? 'DAY' : 'DAYS'}
                        </p>
                      </div>
                    )}
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
                History <Icon name="chevron-square-right" tw="ml-1" />
              </Button>
            </div>
            {/* <div tw="overflow-x-auto">
              <StyledTable
                // borderType="none"
                // rowNoise
                rowKey={(row) => row.id}
                data={data}
                columns={[
                  {
                    label: 'STATUS',
                    align: 'left',
                    sortable: true,
                    render: (row) => {
                      let color = 'warning'

                      switch (row.status) {
                        case 'finished':
                          color = 'success'
                          break
                        case 'ongoing':
                          color = 'warning'
                          break
                        case 'failed':
                          color = 'error'
                          break
                      }

                      return (
                        <div tw="relative h-6 w-6">
                          <Icon
                            name="circle"
                            gradient={color}
                            tw="absolute top-0 left-0"
                            size="24px"
                          ></Icon>
                          <Icon
                            name="circle"
                            color="base0"
                            tw="absolute top-[1.5px] left-[1.5px]"
                            size="21px"
                          />
                          <Icon
                            name="alien-8bit"
                            gradient={color}
                            tw="absolute top-[4px] left-[2px]"
                            size="16px"
                          />
                        </div>
                      )
                    },
                  },
                  {
                    label: 'DATE',
                    align: 'left',
                    sortable: true,
                    render: (row) => row.date,
                  },
                  // {
                  //   label: 'AMOUNT',
                  //   align: 'left',
                  //   sortable: true,
                  //   render: (row) => row.amount,
                  // },
                  // {
                  //   label: 'ASSET',
                  //   align: 'left',
                  //   sortable: true,
                  //   render: (row) => row.asset,
                  // },
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
                    render: (row) => {
                      return (
                        <DetailsMenuButton
                          menuItems={[{ label: 'Report issue', href: '/' }]}
                        />
                      )
                    },
                    cellProps: () => ({
                      css: tw`pl-3!`,
                    }),
                  },
                ]}
              />
            </div> */}
          </div>
        </div>
      </ToggleDashboard>
    </section>
  )
}
