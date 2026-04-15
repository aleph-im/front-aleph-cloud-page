import React, { memo, useMemo, useState } from 'react'
import 'twin.macro'
import { useTheme } from 'styled-components'
import { NoisyContainer, Icon, ColorDot, TextGradient } from '@aleph-front/core'
import BorderBox from '@/components/common/BorderBox'
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
import { Card1 } from '@/components/common/Card1'
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

  // total_cost_credit is in credits per second
  const expenseRates = useMemo(() => {
    if (!costsSummary) return null
    const perSecond = parseFloat(costsSummary.total_cost_credit)
    return {
      hourly: perSecond * 3600,
      daily: perSecond * 3600 * 24,
      monthly: perSecond * 3600 * 24 * 30,
      yearly: perSecond * 3600 * 24 * 365,
    }
  }, [costsSummary])

  // Calculate how long the balance will last at current rate
  const runRate = useMemo(() => {
    if (!expenseRates || !accountCreditBalance || accountCreditBalance <= 0)
      return null
    if (expenseRates.hourly <= 0) return null

    const totalHours = accountCreditBalance / expenseRates.hourly
    const years = Math.floor(totalHours / (24 * 365))
    const months = Math.floor((totalHours % (24 * 365)) / (24 * 30))
    const days = Math.floor((totalHours % (24 * 30)) / 24)
    const hours = Math.floor(totalHours % 24)

    return { totalHours, years, months, days, hours }
  }, [expenseRates, accountCreditBalance])

  const isLowBalance = runRate && runRate.totalHours < 72

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
      <div tw="flex flex-wrap gap-6 items-stretch mt-3">
        <div style={{ flex: '1 1 12rem', minWidth: '12rem', display: 'flex' }}>
          <NoisyContainer tw="w-full">
            <p className="tp-info text-base2">BALANCE</p>
            {accountCreditBalance !== undefined ? (
              <p className="text-main0 tp-h7" tw="mt-1">
                {formatCredits(accountCreditBalance)}
              </p>
            ) : (
              <Skeleton width="5rem" height="1.5rem" />
            )}
          </NoisyContainer>
        </div>

        <div style={{ flex: '1 1 12rem', minWidth: '12rem', display: 'flex' }}>
          <NoisyContainer tw="w-full">
            <p className="tp-info text-base2">TOTAL SPENT</p>
            {costsLoading ? (
              <Skeleton width="5rem" height="1.5rem" />
            ) : (
              <p className="text-main0 tp-h7" tw="mt-1">
                {formatCredits(totalSpent)}
              </p>
            )}
          </NoisyContainer>
        </div>

        <div style={{ flex: '2 1 20rem', minWidth: '20rem', display: 'flex' }}>
          <NoisyContainer tw="w-full">
            <p className="tp-info text-base2">EXPENSE RATES</p>
            {costsLoading ? (
              <Skeleton width="100%" height="1.5rem" />
            ) : expenseRates ? (
              <div
                tw="flex flex-wrap gap-4 mt-1 justify-between"
                style={{ maxWidth: '28rem' }}
              >
                <div>
                  <p className="text-main0 tp-h7" tw="text-16">
                    {formatCredits(expenseRates.hourly)}
                  </p>
                  <p className="tp-info text-base2" tw="text-10">
                    /HOUR
                  </p>
                </div>
                <div>
                  <p className="text-main0 tp-h7" tw="text-16">
                    {formatCredits(expenseRates.daily)}
                  </p>
                  <p className="tp-info text-base2" tw="text-10">
                    /DAY
                  </p>
                </div>
                <div>
                  <p className="text-main0 tp-h7" tw="text-16">
                    {formatCredits(expenseRates.monthly)}
                  </p>
                  <p className="tp-info text-base2" tw="text-10">
                    /MONTH
                  </p>
                </div>
                <div>
                  <p className="text-main0 tp-h7" tw="text-16">
                    {formatCredits(expenseRates.yearly)}
                  </p>
                  <p className="tp-info text-base2" tw="text-10">
                    /YEAR
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
      </div>

      {/* Low balance warning */}
      {isLowBalance && (
        <BorderBox $color="error" tw="mt-4 relative" className="tp-body1">
          <span tw="flex items-center gap-2">
            <Icon name="exclamation-triangle" />
            Your balance will run out in less than 72 hours at the current rate.
            Please top up your credits to avoid service interruptions.
          </span>
        </BorderBox>
      )}

      {/* Run rate duration */}
      {runRate && !costsLoading && (
        <div tw="mt-4">
          <NoisyContainer tw="w-full">
            <div tw="flex items-center gap-3 flex-wrap">
              <p className="tp-info text-base2">ESTIMATED RUN TIME</p>
              <div tw="flex gap-4 items-end">
                {runRate.years > 0 && (
                  <div tw="flex items-end gap-1">
                    <p className="text-main0 tp-h7" tw="text-16">
                      {runRate.years}
                    </p>
                    <p className="tp-info text-base2" tw="text-10">
                      {runRate.years === 1 ? 'YEAR' : 'YEARS'}
                    </p>
                  </div>
                )}
                {(runRate.years > 0 || runRate.months > 0) && (
                  <div tw="flex items-end gap-1">
                    <p className="text-main0 tp-h7" tw="text-16">
                      {runRate.months}
                    </p>
                    <p className="tp-info text-base2" tw="text-10">
                      {runRate.months === 1 ? 'MONTH' : 'MONTHS'}
                    </p>
                  </div>
                )}
                <div tw="flex items-end gap-1">
                  <p className="text-main0 tp-h7" tw="text-16">
                    {runRate.days}
                  </p>
                  <p className="tp-info text-base2" tw="text-10">
                    {runRate.days === 1 ? 'DAY' : 'DAYS'}
                  </p>
                </div>
                <div tw="flex items-end gap-1">
                  <p className="text-main0 tp-h7" tw="text-16">
                    {runRate.hours}
                  </p>
                  <p className="tp-info text-base2" tw="text-10">
                    {runRate.hours === 1 ? 'HOUR' : 'HOURS'}
                  </p>
                </div>
              </div>
            </div>
          </NoisyContainer>
        </div>
      )}

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
          <div tw="flex gap-6 flex-wrap items-stretch">
            {/* Pie Charts */}
            <div
              style={{ flex: '1 1 12rem', minWidth: '12rem', display: 'flex' }}
            >
              <Card1 tw="w-full">
                <div tw="flex flex-col items-center">
                  <TextGradient
                    forwardedAs="h3"
                    type="info"
                    color="main0"
                    tw="m-0 mb-2"
                  >
                    By Service Type
                  </TextGradient>
                  <PieChart width={120} height={120}>
                    {serviceTypePieData.length > 0 && (
                      <defs>
                        <SVGGradients data={serviceTypePieData} />
                      </defs>
                    )}
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
                    {serviceTypePieData.length > 0 && (
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
                    )}
                  </PieChart>
                  {serviceTypePieData.length > 0 ? (
                    <div
                      tw="mt-2 flex flex-col gap-2"
                      style={{ maxHeight: '8rem', overflowY: 'auto' }}
                    >
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
                  ) : (
                    <p className="text-base2 tp-body3" tw="mt-2">
                      No services
                    </p>
                  )}
                </div>
              </Card1>
            </div>

            <div
              style={{ flex: '1 1 12rem', minWidth: '12rem', display: 'flex' }}
            >
              <Card1 tw="w-full">
                <div tw="flex flex-col items-center">
                  <TextGradient
                    forwardedAs="h3"
                    type="info"
                    color="main0"
                    tw="m-0 mb-2"
                  >
                    Expense Share
                  </TextGradient>
                  <PieChart width={120} height={120}>
                    {expenseSharePieData.length > 0 && (
                      <defs>
                        <SVGGradients data={expenseSharePieData} />
                      </defs>
                    )}
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
                    {expenseSharePieData.length > 0 && (
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
                    )}
                  </PieChart>
                  {expenseSharePieData.length > 0 ? (
                    <div
                      tw="mt-2 flex flex-col gap-2"
                      style={{ maxHeight: '8rem', overflowY: 'auto' }}
                    >
                      {expenseSharePieData.map((entry) => (
                        <div key={entry.label} tw="flex items-center gap-2">
                          <ColorDot
                            $gradient={entry.gradient}
                            $size="0.75rem"
                          />
                          <span className="tp-body3">
                            {entry.displayLabel || entry.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base2 tp-body3" tw="mt-2">
                      No expenses
                    </p>
                  )}
                </div>
              </Card1>
            </div>

            {/* Line Chart */}
            <div
              style={{ flex: '2 1 20rem', minWidth: '20rem', display: 'flex' }}
            >
              <NoisyContainer tw="w-full">
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
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={false}
                      />
                      <Line
                        yAxisId="balance"
                        type="monotone"
                        dataKey="balance"
                        name="Balance"
                        stroke="#22c55e"
                        strokeWidth={3}
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
          </div>
        )}
      </ToggleDashboard>
    </section>
  )
}
CreditStatsHeader.displayName = 'CreditStatsHeader'

export default memo(CreditStatsHeader)
