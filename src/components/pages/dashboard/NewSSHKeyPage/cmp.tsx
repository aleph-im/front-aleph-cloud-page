import Container from '@/components/common/CenteredContainer'
import NoisyContainer from '@/components/common/NoisyContainer'
import { useNewSSHKeyPage } from '@/hooks/pages/dashboard/useNewSSHKeyPage'
import { Button, TextArea, TextInput } from '@aleph-front/aleph-core'

export default function NewSSHKey() {
  const { keyCtrl, labelCtrl, handleSubmit } = useNewSSHKeyPage()

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <NoisyContainer>
              <div>
                <TextArea
                  {...keyCtrl.field}
                  {...keyCtrl.fieldState}
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
      </form>
    </>
  )
}
