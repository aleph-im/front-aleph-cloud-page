import Container from '@/components/common/CenteredContainer'
import NoisyContainer from '@/components/common/NoisyContainer'
import { useNewSSHKeyPage } from '@/hooks/pages/dashboard/useNewSSHKeyPage'
import { Button, TextArea, TextInput } from '@aleph-front/aleph-core'

export default function NewSSHKey() {
  const { key, label, handleChangeKey, handleChangeLabel, handleSubmit } =
    useNewSSHKeyPage()

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <NoisyContainer>
              <div tw="mt-4">
                <TextArea
                  label="SSH Public Key"
                  value={key}
                  onChange={handleChangeKey}
                  name="ssh_key"
                  placeholder="SSH Key"
                  tw="h-40 break-all"
                />
              </div>
              <div tw="mt-4">
                <TextInput
                  label="Label"
                  value={label}
                  onChange={handleChangeLabel}
                  name="ssh_label"
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
