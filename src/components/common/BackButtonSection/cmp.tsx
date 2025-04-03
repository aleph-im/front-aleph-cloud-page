import { Container } from '@/components/pages/console/common'
import { BackButtonSectionProps } from './types'
import BackButton from '../BackButton/cmp'

export const BackButtonSection = ({ handleBack }: BackButtonSectionProps) => (
  <section tw="px-0 py-0! md:pt-10!">
    <Container>
      <BackButton handleBack={handleBack} />
    </Container>
  </section>
)

export default BackButtonSection
