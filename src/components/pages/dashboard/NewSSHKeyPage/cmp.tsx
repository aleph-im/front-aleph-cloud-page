import Container from '@/components/common/CenteredContainer'
import CompositeTitle from '@/components/common/CompositeTitle'
import NoisyContainer from '@/components/common/NoisyContainer'
import Form from '@/components/form/Form'
import { useNewSSHKeyPage } from '@/hooks/pages/dashboard/useNewSSHKeyPage'
import { Button, TextArea, TextInput } from '@aleph-front/aleph-core'

export default function NewSSHKey() {
  const { keyCtrl, labelCtrl, handleSubmit, errors } = useNewSSHKeyPage()

  return (
    <Form onSubmit={handleSubmit} errors={errors}>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <CompositeTitle as="h2" number="1">
            Configure SSH Key
          </CompositeTitle>
          <p tw="mb-6">
            Access your cloud instances securely. Give existing key’s below
            access to this instance or add new keys. Remember, storing private
            keys safely is crucial for security. If you need help, our support
            team is always ready to assist.
          </p>
          <NoisyContainer>
            <div>
              <TextArea
                {...keyCtrl.field}
                {...keyCtrl.fieldState}
                required
                label="SSH Public Key"
                placeholder="SSH Key"
                tw="h-40 break-all"
              />
            </div>
            <div tw="mt-4">
              <TextInput
                {...labelCtrl.field}
                {...labelCtrl.fieldState}
                label="Label"
                placeholder="Label"
              />
            </div>
          </NoisyContainer>
          <div tw="mt-10 text-center">
            <Button
              type="submit"
              color="main0"
              kind="neon"
              size="regular"
              variant="primary"
            >
              Save SSH Key
            </Button>
          </div>
        </Container>
      </section>
    </Form>
  )
}
