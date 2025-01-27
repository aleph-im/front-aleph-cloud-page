import BackButtonSection from '@/components/common/BackButtonSection'
import NewEntityTab from '../NewEntityTab'
import { Container } from '../../dashboard/common'
import { SectionTitle } from '@/components/common/CompositeTitle'
import {
  BulletItem,
  BulletList,
  Button,
  FileInput,
  Icon,
  useCopyToClipboardAndNotify,
} from '@aleph-front/core'
import ExternalLink from '@/components/common/ExternalLink'
import ToggleContainer from '@/components/common/ToggleContainer'
import {
  StyledCodeContainer,
  StyledCopyCodeContainer,
  StyledFileInputContainer,
} from './styles'
import IconText from '@/components/common/IconText'
import { useNewConfidentialPage } from './hook'
import ResponsiveTooltip from '@/components/common/ResponsiveTooltip'

export function ExternalBulletItemLink({
  href,
  title,
}: {
  href: string
  title: string
  description?: string
}) {
  return (
    <a href={href} tw="flex items-end gap-2" target="_blank">
      <BulletItem kind="info" title={title} />
      <Icon name="square-up-right" tw="pb-1.5" />
    </a>
  )
}

export function CodeBlock({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const handleCopyCode = useCopyToClipboardAndNotify(code)

  return (
    <div tw="max-w-full min-w-[10rem] ">
      <StyledCodeContainer>
        <StyledCopyCodeContainer onClick={handleCopyCode}>
          {language}
          <Icon name="copy" className="text-purple4" />
        </StyledCopyCodeContainer>
        <div tw="rounded-b-xl whitespace-pre px-5 pb-8 overflow-auto">
          {code}
        </div>
      </StyledCodeContainer>
    </div>
  )
}

export default function NewConfidentialPage() {
  const {
    commands,
    encryptedDiskImageFormValues,
    encryptedDiskImageCtrl,
    encryptedDiskImageItemHash,
    disabledUploadEncryptedDiskImage,
    isUploadingFile,
    uploadedFileMessage,
    uploadEncryptedDiskImageButtonRef,
    uploadEncryptedDiskImageButtonToolip,
    handleUploadEncryptedDiskImage,
    handleCopyEncryptedDiskImageHash,
    handleBack,
  } = useNewConfidentialPage()
  return (
    <>
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 py-0 md:py-8">
        <Container>
          <NewEntityTab selected="confidential" />
        </Container>
      </section>
      {/* 0. Requirements */}
      <section tw="px-0 pt-20 md:pt-10 pb-5">
        <Container>
          <ToggleContainer
            label={<SectionTitle number={0}>Requirements</SectionTitle>}
            withSwitch={false}
            toggleAlwaysVisible
          >
            <div tw="flex flex-wrap gap-x-24 gap-y-7">
              <div>
                <div className="tp-h7" tw="mb-2">
                  System
                </div>
                <BulletList
                  size="regular"
                  gap="1rem"
                  items={[
                    { kind: 'info', title: 'Machine running Linux on x86_64' },
                    { kind: 'info', title: 'Machine with IPv6 connectiviy' },
                  ]}
                />
              </div>
              <div>
                <div className="tp-h7" tw="mb-2">
                  Software
                </div>
                <BulletList size="regular" gap="1rem" items={[]}>
                  <ExternalBulletItemLink
                    href="https://docs.aleph.im/tools/aleph-client/"
                    title="Aleph Client command-line tool"
                  />
                  <ExternalBulletItemLink
                    href="https://doc.rust-lang.org/cargo/getting-started/installation.html"
                    title="Rust and Cargo"
                  />
                  <ExternalBulletItemLink
                    href="https://github.com/virtee/sevctl"
                    title="Sevctl tool from AMD"
                  />
                  <ExternalBulletItemLink
                    href="https://www.openssh.com/"
                    title="OpenSSH keypair"
                  />
                  <ExternalBulletItemLink
                    href="https://github.com/ipfs/kubo"
                    title="IPFS Server"
                  />
                  <ExternalBulletItemLink
                    href="https://command-not-found.com/guestmount"
                    title="Guestmount"
                  />
                </BulletList>
              </div>
            </div>
          </ToggleContainer>
        </Container>
      </section>
      {/* 1. Create encrypted disk image */}
      <section tw="px-0 pt-0 pb-5">
        <Container>
          <ToggleContainer
            label={
              <SectionTitle number={1}>
                Create encrypted disk image
              </SectionTitle>
            }
            withSwitch={false}
            toggleAlwaysVisible
          >
            <div tw="flex flex-col gap-6 mt-1">
              <div>
                <div className="tp-h7" tw="mb-2">
                  1. Retrieving the scripts
                </div>
                <p tw="mb-2">
                  <strong>Download</strong> the necessary{' '}
                  <strong>sample scripts</strong> from{' '}
                  <ExternalLink
                    href="https://github.com/aleph-im/aleph-vm/tree/main/examples/example_confidential_image"
                    color="main0"
                    text="Aleph VM Examples - Confidential Image"
                  />
                </p>
                <CodeBlock
                  code={commands['retrieveScriptsCommand']}
                  language="bash"
                />
              </div>
              <div>
                <div className="tp-h7" tw="mb-2">
                  2. Customizing the VM
                </div>
                <p tw="mb-2">
                  It is <strong>advised</strong> to at least add a{' '}
                  <strong>user with</strong> both a <strong>password</strong>{' '}
                  and an <strong>SSH key</strong> in the sudo group.
                </p>
                <p>
                  You can <strong>customize your VM</strong> by modifying the{' '}
                  <strong>setup_debian_rootfs.sh</strong> script. This script is
                  executed within the VM&apos;s chroot environment, allowing you
                  to tailor the system according to your needs.
                </p>
                <p>This allows you to:</p>
                <div tw="flex flex-wrap gap-6 mt-2 mb-4">
                  <BulletList
                    size="regular"
                    gap="0.5rem"
                    items={[
                      { kind: 'info', title: 'Add a user.' },
                      { kind: 'info', title: 'Install an SSH key.' },
                    ]}
                  />
                  <BulletList
                    size="regular"
                    gap="0.5rem"
                    items={[
                      { kind: 'info', title: 'Install additional software.' },
                      {
                        kind: 'info',
                        title: 'Modify the default configuration.',
                      },
                    ]}
                  />
                </div>
                <p>
                  Simply add your custom instructions at the end of the{' '}
                  <strong>setup_debian_rootfs.sh</strong> script.
                </p>
              </div>
              <div>
                <div className="tp-h7" tw="mb-2">
                  3. Fetching a base image
                </div>
                <p tw="mb-2">
                  It is <strong>recommended</strong> to start from the{' '}
                  <strong>genericcloud image</strong>, as it contain cloud-init,
                  which is used to setup the network when launching the VM.
                </p>
                <CodeBlock
                  code={commands['fetchBaseImageCommand']}
                  language="bash"
                />
              </div>
              <div>
                <div className="tp-h7" tw="mb-2">
                  4. Extract the root filesystem
                </div>
                <p tw="mb-2">
                  To do so, we simply need to <strong>mount</strong> the{' '}
                  <strong>raw image</strong> with <strong>guestmount</strong>.
                </p>
                <CodeBlock
                  code={commands['mountImageCommand']}
                  language="bash"
                />
                <p tw="mt-2">
                  Then, you can simply <strong>copy</strong> the{' '}
                  <strong>root file system</strong> to any directory.
                </p>
                <p tw="mb-2">
                  Take caution to preserve the proper permission like the setuid
                  bit with the --archive option.
                </p>
                <CodeBlock
                  code={commands['copyRootFileSystemCommand']}
                  language="bash"
                />
                <p tw="my-2">
                  Then, <strong>clean</strong> up the <strong>mount</strong>:
                </p>
                <CodeBlock
                  code={commands['cleanUpMountCommand']}
                  language="bash"
                />
              </div>
              <div>
                <div className="tp-h7" tw="mb-2">
                  5. Create the encrypted disk
                </div>
                <p>
                  Run the <strong>build_debian_image.sh</strong> that will{' '}
                  <strong>create</strong> the image with the{' '}
                  <strong>encrypted disk</strong>
                </p>
                <p tw="mb-2">
                  The <strong>password option</strong> is the{' '}
                  <strong>secret password key</strong>, with which the{' '}
                  <strong>disk will be encrypted</strong>, you will need to pass
                  it to launch the VM.
                </p>
                <CodeBlock
                  code={commands['createEncryptedDiskCommand']}
                  language="bash"
                />
              </div>
            </div>
          </ToggleContainer>
        </Container>
      </section>
      {/* 2. Upload encrypted disk image */}
      <section tw="px-0 pt-0 pb-5">
        <Container>
          <ToggleContainer
            label={
              <SectionTitle number={2}>
                Upload encrypted disk image
              </SectionTitle>
            }
            withSwitch={false}
            toggleAlwaysVisible
          >
            <div tw="flex flex-col gap-6 mt-1">
              <div>
                <strong>Upload</strong> your encrypted disk image created in{' '}
                <strong>Step 1: Create encrypted disk image</strong>
              </div>
              <StyledFileInputContainer
                isEncryptedDiskImagePresent={
                  !!encryptedDiskImageFormValues.encryptedDiskImage
                }
              >
                <FileInput
                  {...encryptedDiskImageCtrl.field}
                  {...encryptedDiskImageCtrl.fieldState}
                />
                {encryptedDiskImageFormValues.encryptedDiskImage && (
                  <>
                    <div ref={uploadEncryptedDiskImageButtonRef}>
                      <Button
                        disabled={disabledUploadEncryptedDiskImage}
                        type="submit"
                        onClick={handleUploadEncryptedDiskImage}
                        animation="icon-to-top-on-hover"
                      >
                        {isUploadingFile ? (
                          <>
                            Uploading <Icon name="spinner" tw="animate-spin" />
                          </>
                        ) : (
                          <>
                            Upload
                            <Icon name="arrow-up" />
                          </>
                        )}
                      </Button>
                    </div>
                    {disabledUploadEncryptedDiskImage && (
                      <ResponsiveTooltip
                        my="bottom-left"
                        at="top-right"
                        targetRef={uploadEncryptedDiskImageButtonRef}
                        content={uploadEncryptedDiskImageButtonToolip}
                      />
                    )}
                  </>
                )}
              </StyledFileInputContainer>

              {uploadedFileMessage && (
                <div>
                  <div className="tp-h7" tw="mb-2">
                    Uploaded encrypted disk image
                  </div>
                  <div className="tp-info text-main0">MESSAGE ITEM HASH</div>
                  <IconText
                    iconName="copy"
                    onClick={handleCopyEncryptedDiskImageHash}
                  >
                    {encryptedDiskImageItemHash}
                  </IconText>
                </div>
              )}
            </div>
          </ToggleContainer>
        </Container>
      </section>
      {/* 3. Create Confidential instance */}
      <section tw="px-0 pt-0 pb-5">
        <Container>
          <ToggleContainer
            label={
              <SectionTitle number={3}>
                Create Confidential Instance
              </SectionTitle>
            }
            withSwitch={false}
            toggleAlwaysVisible
          >
            <div tw="flex flex-col gap-6 mt-1">
              <div>
                <div className="tp-h7" tw="mb-2">
                  1. Create the Confidential Instance
                </div>
                <p tw="mb-2">
                  This command will ask you how much CPU, RAM and Disk you want
                  to use and on which node (CRN) to deploy it.
                </p>
                <CodeBlock
                  code={commands['createConfidentialInstanceCommand']}
                  language="bash"
                />
              </div>
              <div>
                <div className="tp-h7" tw="mb-2">
                  2. Establish channel to your Confidential Instance
                </div>
                <p tw="mb-2">
                  This command will establish a secure channel that will allow a
                  secure communication between your machine and your
                  Confidential Instance
                </p>
                <CodeBlock
                  code={commands['secureChannelWithInstanceCommand']}
                  language="bash"
                />
              </div>
              <div>
                <div className="tp-h7" tw="mb-2">
                  3. Validate and Start your Confidential Instance
                </div>
                <p tw="mb-2">
                  This command will run a validation to check the authenticity
                  of your Confidential Instance and, if everything is correct,
                  will start it.
                </p>
                <CodeBlock
                  code={commands['startInstanceCommand']}
                  language="bash"
                />
              </div>
            </div>
          </ToggleContainer>
        </Container>
      </section>
      <section tw="px-0 pt-6 pb-20">
        <Container tw="flex items-center justify-center pt-8">
          <Button
            as="a"
            href="/computing/confidential"
            animation="icon-to-right-on-hover"
          >
            Check your Confidentials <Icon name="arrow-right" />
          </Button>
        </Container>
      </section>
    </>
  )
}
