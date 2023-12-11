import { StyledTable } from './styles'
import { TableProps } from '@aleph-front/aleph-core'

export default function EntityTable<T extends Record<string, unknown>>(
  props: TableProps<T>,
) {
  return <StyledTable {...(props as any)} />
}
