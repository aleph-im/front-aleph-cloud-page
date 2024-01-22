import { memo } from 'react'
import { Button } from '@aleph-front/core'
import FlatCardButton, {
  FlatCardButtonContainer,
} from '@/components/common/FlatCardButton'
import Container from '@/components/common/CenteredContainer'
import InfoTooltipButton from '@/components/common/InfoTooltipButton'
import { PaymentMethod } from '@/helpers/constants'
import NewEntityTab from '../NewEntityTab'
import { useNewInstancePage } from '@/hooks/pages/computing/useNewInstancePage'
import { SectionTitle } from '@/components/common/CompositeTitle'

export const NewInstancePage = () => {
  const { selected, handleClickHold, handleClickStream, handleContinue } =
    useNewInstancePage()

  return (
    <>
      <section tw="px-0 py-0 md:py-8">
        <Container>
          <NewEntityTab selected="instance" />
        </Container>
      </section>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <SectionTitle number="1">Configure instance setup</SectionTitle>
          <p className="text-text">
            Start by choosing your instance setup approach. Select based on your
            preferred specifications or choose a specific compute node to tailor
            your virtual machine (VM).
          </p>
          <div tw="px-0 mt-12 mb-6">
            <FlatCardButtonContainer tw="flex-wrap md:justify-center">
              <FlatCardButton
                $selected={selected === PaymentMethod.Hold}
                onClick={handleClickHold}
                tw="flex-auto lg:flex-1 h-40 p-6"
              >
                <div className="tp-body1 fs-10">Select by specification</div>
                <div className="tp-h7" tw="text-center mt-4">
                  <div>Automatic</div>
                  node allocation
                </div>
              </FlatCardButton>
              <FlatCardButton
                $selected={selected === PaymentMethod.Stream}
                onClick={handleClickStream}
                tw="flex-auto lg:flex-1 h-40 p-6"
              >
                <div className="tp-body1 fs-10">Select by node</div>
                <div className="tp-h7" tw="text-center mt-4">
                  <div>Manual</div>
                  node allocation
                </div>
              </FlatCardButton>
            </FlatCardButtonContainer>
          </div>
          <div tw="mt-6 text-right">
            <InfoTooltipButton
              my="bottom-right"
              at="top-right"
              tooltipContent={
                <div className="tp-body1 fs-18">
                  <div tw="mb-8">
                    <div className="tp-body2 fs-18">
                      Automatic node selection
                    </div>
                    Choose your desired specs (like CPU, memory, storage) and
                    let the system automatically assign an optimal compute node
                    for your instance.
                  </div>
                  <div>
                    <div className="tp-body2 fs-18">Manual node selection</div>
                    Pick a specific compute node first based on its
                    characteristics and then customize the available specs for
                    your instance on that node.
                  </div>
                </div>
              }
            >
              More info
            </InfoTooltipButton>
          </div>
          <div tw="mt-6 text-center">
            <Button
              color="main0"
              kind="default"
              variant="primary"
              size="lg"
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}

export default memo(NewInstancePage)
