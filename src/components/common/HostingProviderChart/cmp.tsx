import { memo, useMemo } from 'react'
import { ColorDot, TextGradient } from '@aleph-front/core'
import { AlephNode } from '@/domain/node'
import Card1 from '../Card1'
import { useHostingProviderTop } from '@/hooks/common/node/useHostingProviderTop'

export const HostingProviderChart = ({
  title,
  nodes,
  ...rest
}: {
  title: string
  nodes?: AlephNode[]
}) => {
  const { top } = useHostingProviderTop({ nodes })

  const data = useMemo(() => {
    return top.map(({ name, count, percentage, color }) => {
      return {
        label: `${count} nodes (${(percentage * 100).toFixed(0)}%)`,
        value: name,
        percentage,
        color,
      }
    })
  }, [top])

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

      <div tw="mt-1 flex flex-col gap-4">
        {data.map((entry) => (
          <div key={entry.value} tw="flex items-center gap-3">
            <ColorDot $color={entry.color} $size="1.25rem" />
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
    </Card1>
  )
}
HostingProviderChart.displayName = 'HostingProviderChart'

export default memo(HostingProviderChart)
