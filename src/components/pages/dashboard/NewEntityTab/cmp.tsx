import { Tabs } from '@aleph-front/aleph-core'
import {
  UseNewEntityTabProps,
  useNewEntityTab,
} from '@/hooks/pages/dashboard/useNewEntityTab'

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
          label: { label: 'BETA', position: 'top' },
        },
        {
          id: 'confidential',
          name: 'Confidential',
          disabled: true,
          label: { label: 'SOON', position: 'top' },
        },
      ]}
      tw="overflow-auto"
    />
  )
}
