import { Tabs } from '@aleph-front/core'
import { UseNewEntityTabProps, useNewEntityTab } from './hook'

export type NewEntityTabProps = UseNewEntityTabProps

export default function NewEntityTab(props: NewEntityTabProps) {
  const { selected, handleChange } = useNewEntityTab(props)

  return (
    <Tabs
      selected={selected}
      onTabChange={handleChange}
      tabs={[
        {
          id: 'function',
          name: 'Function',
        },
        {
          id: 'instance',
          name: 'Instance',
        },
        {
          id: 'gpu-instance',
          name: 'GPU Instance',
          label: { label: 'BETA', position: 'top' },
        },
        {
          id: 'confidential',
          name: 'TEE Instance',
          label: { label: 'BETA', position: 'top' },
        },
      ]}
      tw="overflow-hidden"
    />
  )
}
