import { Container } from '@/components/pages/dashboard/common'
import { Button, Icon } from '@aleph-front/core'
import { BackButtonSectionProps } from './types'

export const BackButtonSection = ({ handleBack }: BackButtonSectionProps) => (
  <section tw="px-0 py-0! md:pt-10!">
    <Container>
      <Button kind="functional" variant="textOnly" onClick={handleBack}>
        <p
          className="tp-info text-base2"
          tw="flex items-center justify-center text-center gap-1"
        >
          <Icon name="arrow-left" /> Back
        </p>
      </Button>
    </Container>
  </section>
)

export default BackButtonSection
