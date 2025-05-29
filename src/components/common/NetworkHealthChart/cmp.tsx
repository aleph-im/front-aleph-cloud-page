import { memo, useMemo } from 'react'
import { AlephNode } from '@/domain/node'
import { Cell, Pie, PieChart } from 'recharts'
import { useTheme } from 'styled-components'
import Card1 from '../Card1'
import { ColorDot, TextGradient } from '@aleph-front/core'
import { SVGGradients } from '../charts'

export const NetworkHealthChart = ({
  title,
  nodes,
  ...rest
}: {
  title: string
  nodes?: AlephNode[]
}) => {
  const theme = useTheme()

  const data = useMemo(() => {
    const safeNodes = nodes || []

    const totalNodes = safeNodes.length
    const activeNodes = safeNodes.reduce(
      (ac, node) => ac + Number(node.score >= 0.8),
      0,
    )
    const warningNodes = safeNodes.reduce(
      (ac, node) => ac + Number(node.score >= 0.5 && node.score < 0.8),
      0,
    )
    const errorNodes = safeNodes.reduce(
      (ac, node) => ac + Number(node.score < 0.5),
      0,
    )
    const otherNodes = totalNodes - activeNodes - warningNodes - errorNodes

    return [
      {
        label: 'active nodes',
        value: `${activeNodes} nodes`,
        percentage: activeNodes / totalNodes,
        gradient: 'success',
      },
      {
        label: '50% < 80%',
        value: `${warningNodes} nodes`,
        percentage: warningNodes / totalNodes,
        gradient: 'warning',
      },
      {
        label: '< 50%',
        value: `${errorNodes} nodes`,
        percentage: errorNodes / totalNodes,
        color: 'error',
      },
      {
        label: 'other',
        value: `${otherNodes} nodes`,
        percentage: otherNodes / totalNodes,
        color: 'main0',
      },
    ]
  }, [nodes])

  const disabledColor = theme.color.disabled2
  const cols = 2
  const reverseData = [...data].reverse()

  return (
    <Card1 loading={!nodes} {...rest}>
      <TextGradient
        forwardedAs="h3"
        type="info"
        color="main0"
        tw="m-0 min-h-[2rem]"
      >
        {title}
      </TextGradient>

      <div tw="flex flex-col items-center">
        <PieChart
          width={100}
          height={100}
          margin={{}}
          tw="my-3 min-h-[6.25rem]"
        >
          <defs>
            <SVGGradients data={data} />
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
            data={reverseData}
            dataKey="percentage"
            stroke="transparent"
            innerRadius="72%"
            outerRadius="100%"
            startAngle={360 + 90}
            endAngle={0 + 90}
          >
            {reverseData.map((entry) => {
              const color = `gr-${entry.gradient}`
              const fill = entry.gradient
                ? `url(#${color})`
                : entry.color
                  ? theme.color[entry.color] || entry.color
                  : undefined

              return <Cell key={entry.label} fill={fill} />
            })}
          </Pie>
          <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            className="tp-body3 fs-24"
            fill={theme.color.text}
          >
            {nodes?.length || 0}
          </text>
        </PieChart>

        <div tw="mt-1 flex items-stretch justify-center w-full gap-6">
          {Array.from({ length: cols }, (_, col) => (
            <div key={col} tw="flex flex-col gap-4">
              {data.slice(col * cols, col * cols + cols).map((entry) => (
                <div key={entry.label} tw="flex items-center gap-3">
                  <ColorDot
                    $color={
                      entry.color === 'transparent'
                        ? disabledColor
                        : entry.color
                    }
                    $gradient={entry.gradient}
                    $size="1.25rem"
                  />
                  <div
                    tw="flex flex-col justify-between leading-4! gap-1 not-italic whitespace-nowrap"
                    className="tp-body3"
                  >
                    <div>{entry.value}</div>
                    <div className="fs-10" tw="opacity-60">
                      {entry.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card1>
  )
}
NetworkHealthChart.displayName = 'NetworkHealthChart'

export default memo(NetworkHealthChart)
