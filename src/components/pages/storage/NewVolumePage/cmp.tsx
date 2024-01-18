import { EntityType, PaymentMethod } from '@/helpers/constants'
import { useNewVolumePage } from '@/hooks/pages/storage/useNewVolumePage'
import { Button } from '@aleph-front/core'
import HoldingRequirements from '@/components/form/HoldingRequirements'
import Container from '@/components/common/CenteredContainer'
import { AddNewVolume } from '@/components/form/AddVolume'
import { Form } from '@/components/form/Form'
import { SectionTitle } from '@/components/common/CompositeTitle'

export default function NewVolumePage() {
  const {
    control,
    values,
    address,
    accountBalance,
    isCreateButtonDisabled,
    errors,
    handleSubmit,
  } = useNewVolumePage()

  return (
    <Form onSubmit={handleSubmit} errors={errors}>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <SectionTitle number="1">Add volume</SectionTitle>
          <AddNewVolume control={control} />
        </Container>
      </section>
      <HoldingRequirements
        address={address}
        type={EntityType.Volume}
        volumes={[values]}
        unlockedAmount={accountBalance}
        paymentMethod={PaymentMethod.Hold}
        description={
          <>
            This amount needs to be present in your wallet until the volume is
            removed. Tokens won &#39;t be locked nor consumed. The volume will
            be garbage collected once funds are removed from the wallet.
          </>
        }
        button={
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
        }
      />
    </Form>
  )
}
