import { AddNewVolume } from '@/components/form/AddVolume'
import { EntityType } from '@/helpers/constants'
import { useNewVolumePage } from '@/hooks/pages/dashboard/useNewVolumePage'
import { Button, TextGradient } from '@aleph-front/aleph-core'
import HoldingRequirements from '@/components/common/HoldingRequirements'
import { default as Container } from '@/components/common/CenteredContainer'

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
            <AddNewVolume
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
                type={EntityType.Volume}
                volumes={[formState.volume]}
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
