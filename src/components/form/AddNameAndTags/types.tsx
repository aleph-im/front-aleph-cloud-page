import { NameAndTags } from '@/hooks/form/useAddNameAndTags'

export type AddNameAndTagsProps = NameAndTags & {
  onChange: (state: NameAndTags) => void
}
