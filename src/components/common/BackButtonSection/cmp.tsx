import { BackButtonSectionProps } from './types'
import BackButton from '../BackButton/cmp'
import { CenteredContainer } from '../CenteredContainer'

export const BackButtonSection = ({ handleBack }: BackButtonSectionProps) => (
  <section tw="px-0 py-0! md:pt-10!">
    <CenteredContainer>
      <BackButton handleBack={handleBack} />
    </CenteredContainer>
  </section>
)

export default BackButtonSection
