import { memo, useMemo } from 'react'
import { ColorDot, TextGradient } from '@aleph-front/core'
import Card1 from '../Card1'
import { humanReadableSize } from '@/helpers/utils'

export const TotalNetworkResourcesChart = ({
  title,
  resources,
  ...rest
}: {
  title: string
  resources?: {
    cpu: number
    ram: number
    hdd: number
    nodes: number
    total: number
  }
}) => {
  const data = useMemo(() => {
    return [
      {
        label: 'CPU',
        value: resources?.cpu || '-',
        color: 'main1',
      },
      {
        label: 'RAM',
        value: humanReadableSize(resources?.ram, 'MiB'),
        color: 'main1',
      },
      {
        label: 'HDD',
        value: humanReadableSize(resources?.hdd, 'MiB'),
        color: 'main1',
      },
    ]
  }, [resources])

  return (
    <Card1 loading={!resources} {...rest}>
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
          <div key={entry.label} tw="flex items-center gap-3">
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
        <div className="fs-10 tp-body1" tw="opacity-60">
          <div>Total amount of resources on the network.</div>
          {resources?.nodes && (
            <div>
              (Using {resources?.nodes} active nodes of {resources?.total})
            </div>
          )}
        </div>
      </div>
    </Card1>
  )
}
TotalNetworkResourcesChart.displayName = 'TotalNetworkResourcesChart'

export default memo(TotalNetworkResourcesChart)
