import React, { memo, useState } from 'react'
import 'twin.macro'
import { useTheme } from 'styled-components'
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
import { ColorDot, NoisyContainer, TextGradient } from '@aleph-front/core'
import { SVGGradients } from '@/components/common/charts'
import ToggleDashboard from '@/components/common/ToggleDashboard'
import Skeleton from '@/components/common/Skeleton'
import { SectionTitle } from '@/components/common/CompositeTitle'
import { useCreditCharts } from './hook'
import { CreditChartsProps } from './types'
import { formatCredits } from '@/helpers/utils'

const CreditCharts = ({
  isConnected,
  costsResources,
  costsLoading,
}: CreditChartsProps) => {
  const theme = useTheme()
  const [chartsOpen, setChartsOpen] = useState(false)

  const {
    serviceTypePieData,
    expenseSharePieData,
    dailyChartData,
    chartLoading,
  } = useCreditCharts(costsResources)

  const disabledColor = theme.color.disabled2
  const isLoading = costsLoading || chartLoading

  return (
    <section tw="px-0 pb-6 pt-6 lg:pb-5">
      <SectionTitle>Charts</SectionTitle>
      <ToggleDashboard
        open={chartsOpen}
        setOpen={setChartsOpen}
        toggleButton={{
          children: <>Show charts</>,
          disabled: !isConnected,
        }}
      >
        {isLoading ? (
          <div tw="flex gap-6 flex-wrap">
            <Skeleton width="100%" height="16rem" />
          </div>
        ) : (
          <div tw="flex gap-6 flex-wrap">
            {/* Pie Charts */}
            <NoisyContainer tw="flex-1 min-w-[20rem]">
              <div tw="flex gap-6 flex-wrap justify-around">
                {/* Service type distribution */}
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

                {/* Expense share */}
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
            <NoisyContainer tw="flex-[2] min-w-[20rem]">
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
                      stroke={theme.color.main0}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      yAxisId="balance"
                      type="monotone"
                      dataKey="balance"
                      name="Balance"
                      stroke={theme.color.info}
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
CreditCharts.displayName = 'CreditCharts'

export default memo(CreditCharts)
