import BaseContainer from '@/components/Container'
import HoldingRequirements from '@/components/HoldingRequirements'
import NewVolume from '@/components/form/AddVolume'
import { useNewVolumePage } from '@/hooks/pages/useNewVolumePage'
import { Button, Col, Row, TextGradient } from '@aleph-front/aleph-core'
import { ReactNode } from 'react'

const Container = ({ children }: { children: ReactNode }) => (
  <Row xs={1} lg={12} gap="0">
    <Col xs={1} lg={10} lgOffset={2} xl={8} xlOffset={3} xxl={6} xxlOffset={4}>
      <BaseContainer>
        <div tw="max-w-[715px] mx-auto">{children}</div>
      </BaseContainer>
    </Col>
  </Row>
)

export default function NewVolumePage() {
  const {
    formState,
    handleSubmit,
    handleChangeVolume,
    address,
    accountBalance,
    isCreateButtonDisabled,
  } = useNewVolumePage()

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <NewVolume
              isStandAlone
              volume={formState.volume}
              onChange={handleChangeVolume}
            />
          </Container>
        </section>
        <section
          className="fx-noise-light"
          tw="px-0 pt-6 pb-24 md:pt-16 md:pb-32"
        >
          <Container>
            <TextGradient forwardedAs="h2" type="h5" tw="mb-1">
              Estimated holding requirements
            </TextGradient>
            <div tw="mt-1 mb-6">
              <p className="text-main2">
                This amount needs to be present in your wallet until the
                function is removed. Tokens won &#39;t be locked nor consumed.
                The function will be garbage collected once funds are removed
                from the wallet.
              </p>
            </div>
            <div tw="my-7">
              <HoldingRequirements
                address={address}
                storage={[formState.volume]}
                unlockedAmount={accountBalance}
              />
            </div>
            <div tw="my-7 text-center">
              <Button
                type="submit"
                color="main0"
                kind="neon"
                size="big"
                variant="primary"
                disabled={isCreateButtonDisabled}
              >
                Create volume
              </Button>
            </div>
          </Container>
        </section>
      </form>
    </>
  )
}
