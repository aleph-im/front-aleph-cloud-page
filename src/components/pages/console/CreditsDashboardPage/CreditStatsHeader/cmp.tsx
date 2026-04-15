import React, { memo, useMemo, useState } from 'react'
import 'twin.macro'
import { useTheme } from 'styled-components'
import { NoisyContainer, Icon, ColorDot, TextGradient } from '@aleph-front/core'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { SVGGradients } from '@/components/common/charts'
import Skeleton from '@/components/common/Skeleton'
import ToggleDashboard from '@/components/common/ToggleDashboard'
import { formatCredits } from '@/helpers/utils'
import { SectionTitle } from '@/components/common/CompositeTitle'
import { useCreditCharts } from '../CreditCharts/hook'
import { CreditStatsHeaderProps } from './types'

const CreditStatsHeader = ({
  isConnected,
  accountCreditBalance,
  costsSummary,
  costsResources,
  costsLoading,
}: CreditStatsHeaderProps) => {
  const theme = useTheme()
  const [detailsOpen, setDetailsOpen] = useState(true)
  const totalSpent = costsSummary?.total_consumed_credits
  const disabledColor = theme.color.disabled2

  const expenseRates = useMemo(() => {
    if (!costsSummary) return null
    const hourly = parseFloat(costsSummary.total_cost_credit)
    return {
      hourly,
      daily: hourly * 24,
      monthly: hourly * 24 * 30,
      yearly: hourly * 24 * 365,
    }
  }, [costsSummary])

  const {
    serviceTypePieData,
    expenseSharePieData,
    dailyChartData,
    chartLoading,
  } = useCreditCharts(costsResources)

  const isLoading = costsLoading || chartLoading

  return (
    <section tw="px-0 pb-6 pt-12 lg:pb-5">
      <SectionTitle>Credits Overview</SectionTitle>

      {/* Stats cards */}
      <div tw="flex flex-wrap gap-4 items-stretch mt-3">
        <NoisyContainer tw="flex-1 min-w-[12rem]">
          <p className="tp-info text-base2">BALANCE</p>
          {accountCreditBalance !== undefined ? (
            <p className="text-main0 tp-h7" tw="mt-1">
              {formatCredits(accountCreditBalance)}
            </p>
          ) : (
            <Skeleton width="5rem" height="1.5rem" />
          )}
        </NoisyContainer>

        <NoisyContainer tw="flex-1 min-w-[12rem]">
          <p className="tp-info text-base2">TOTAL SPENT</p>
          {costsLoading ? (
            <Skeleton width="5rem" height="1.5rem" />
          ) : (
            <p className="text-main0 tp-h7" tw="mt-1">
              {formatCredits(totalSpent)}
            </p>
          )}
        </NoisyContainer>

        <NoisyContainer tw="flex-1 min-w-[18rem]">
          <p className="tp-info text-base2">EXPENSE RATES</p>
          {costsLoading ? (
            <Skeleton width="100%" height="1.5rem" />
          ) : expenseRates ? (
            <div tw="flex flex-wrap gap-4 mt-1">
              <div>
                <p className="tp-info text-base2" tw="text-10">
                  /HOUR
                </p>
                <p className="text-main0 tp-body1">
                  {formatCredits(expenseRates.hourly * 1_000_000)}
                </p>
              </div>
              <div>
                <p className="tp-info text-base2" tw="text-10">
                  /DAY
                </p>
                <p className="text-main0 tp-body1">
                  {formatCredits(expenseRates.daily * 1_000_000)}
                </p>
              </div>
              <div>
                <p className="tp-info text-base2" tw="text-10">
                  /MONTH
                </p>
                <p className="text-main0 tp-body1">
                  {formatCredits(expenseRates.monthly * 1_000_000)}
                </p>
              </div>
              <div>
                <p className="tp-info text-base2" tw="text-10">
                  /YEAR
                </p>
                <p className="text-main0 tp-body1">
                  {formatCredits(expenseRates.yearly * 1_000_000)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-base2 tp-body1" tw="mt-1">
              No active services
            </p>
          )}
        </NoisyContainer>
      </div>

      {/* Charts (collapsible, merged into this section) */}
      <ToggleDashboard
        open={detailsOpen}
        setOpen={setDetailsOpen}
        toggleButton={{
          children: (
            <>
              Show details <Icon name="chart-pie" />
            </>
          ),
          disabled: !isConnected,
        }}
      >
        {isLoading ? (
          <Skeleton width="100%" height="16rem" />
        ) : (
          <div tw="flex gap-6 flex-wrap">
            {/* Pie Charts */}
            <NoisyContainer tw="flex-1 min-w-[20rem]">
              <div tw="flex gap-6 flex-wrap justify-around">
                <div tw="flex flex-col items-center">
                  <TextGradient
                    forwardedAs="h3"
                    type="info"
                    color="main0"
                    tw="m-0 mb-2"
                  >
                    By Service Type
                  </TextGradient>
                  {serviceTypePieData.length > 0 ? (
                    <>
                      <PieChart width={120} height={120}>
                        <defs>
                          <SVGGradients data={serviceTypePieData} />
                        </defs>
                        <Pie
                          data={[{ v: 1 }]}
                          dataKey="v"
                          stroke="transparent"
                          innerRadius="72%"
                          outerRadius="100%"
                          startAngle={360 + 90}
                          endAngle={0 + 90}
                          isAnimationActive={false}
                          fill={disabledColor}
                        />
                        <Pie
                          data={serviceTypePieData}
                          dataKey="value"
                          stroke="transparent"
                          innerRadius="72%"
                          outerRadius="100%"
                          startAngle={360 + 90}
                          endAngle={0 + 90}
                        >
                          {serviceTypePieData.map((entry) => {
                            const color = `gr-${entry.gradient}`
                            const fill = entry.gradient
                              ? `url(#${color})`
                              : entry.color
                                ? theme.color[entry.color] || entry.color
                                : undefined
                            return <Cell key={entry.label} fill={fill} />
                          })}
                        </Pie>
                      </PieChart>
                      <div tw="mt-2 flex flex-col gap-2">
                        {serviceTypePieData.map((entry) => (
                          <div key={entry.label} tw="flex items-center gap-2">
                            <ColorDot
                              $gradient={entry.gradient}
                              $size="0.75rem"
                            />
                            <span className="tp-body3">
                              {entry.value} {entry.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-base2 tp-body3">No services</p>
                  )}
                </div>

                <div tw="flex flex-col items-center">
                  <TextGradient
                    forwardedAs="h3"
                    type="info"
                    color="main0"
                    tw="m-0 mb-2"
                  >
                    Expense Share
                  </TextGradient>
                  {expenseSharePieData.length > 0 ? (
                    <>
                      <PieChart width={120} height={120}>
                        <defs>
                          <SVGGradients data={expenseSharePieData} />
                        </defs>
                        <Pie
                          data={[{ v: 1 }]}
                          dataKey="v"
                          stroke="transparent"
                          innerRadius="72%"
                          outerRadius="100%"
                          startAngle={360 + 90}
                          endAngle={0 + 90}
                          isAnimationActive={false}
                          fill={disabledColor}
                        />
                        <Pie
                          data={expenseSharePieData}
                          dataKey="value"
                          stroke="transparent"
                          innerRadius="72%"
                          outerRadius="100%"
                          startAngle={360 + 90}
                          endAngle={0 + 90}
                        >
                          {expenseSharePieData.map((entry) => {
                            const color = `gr-${entry.gradient}`
                            const fill = entry.gradient
                              ? `url(#${color})`
                              : entry.color
                                ? theme.color[entry.color] || entry.color
                                : undefined
                            return <Cell key={entry.label} fill={fill} />
                          })}
                        </Pie>
                      </PieChart>
                      <div tw="mt-2 flex flex-col gap-2">
                        {expenseSharePieData.map((entry) => (
                          <div key={entry.label} tw="flex items-center gap-2">
                            <ColorDot
                              $gradient={entry.gradient}
                              $size="0.75rem"
                            />
                            <span className="tp-body3">{entry.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-base2 tp-body3">No expenses</p>
                  )}
                </div>
              </div>
            </NoisyContainer>

            {/* Line Chart */}
            <NoisyContainer tw="flex-1 min-w-[20rem]">
              <TextGradient
                forwardedAs="h3"
                type="info"
                color="main0"
                tw="m-0 mb-4"
              >
                30-Day Activity
              </TextGradient>
              {dailyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dailyChartData}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v: string) => v.slice(5)}
                      stroke={theme.color.base2}
                    />
                    <YAxis
                      yAxisId="expenses"
                      orientation="left"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v: number) => formatCredits(v, 0)}
                      stroke={theme.color.base2}
                    />
                    <YAxis
                      yAxisId="balance"
                      orientation="right"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v: number) => formatCredits(v, 0)}
                      stroke={theme.color.base2}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCredits(value),
                        name,
                      ]}
                      labelFormatter={(label: string) => `Date: ${label}`}
                      contentStyle={{
                        background: theme.color.base0,
                        border: `1px solid ${theme.color.base2}`,
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="expenses"
                      type="monotone"
                      dataKey="expenses"
                      name="Daily Expenses"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      yAxisId="balance"
                      type="monotone"
                      dataKey="balance"
                      name="Balance"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-base2 tp-body3">
                  No activity in the last 30 days
                </p>
              )}
            </NoisyContainer>
          </div>
        )}
      </ToggleDashboard>
    </section>
  )
}
CreditStatsHeader.displayName = 'CreditStatsHeader'

export default memo(CreditStatsHeader)
