import { ReactNode, useState } from 'react'
import {
  Button,
  ChipInput,
  CodeEditor,
  Col,
  Icon,
  Radio,
  RadioGroup,
  Row,
  Tabs,
  TextGradient,
  TextInput,
} from '@aleph-front/aleph-core'
import CompositeTitle from '@/components/CompositeTitle'
import NoisyContainer from '@/components/NoisyContainer'
import HiddenFileInput from '@/components/HiddenFileInput'
import { isValidItemHash } from '@/helpers/utils'
import { useNewFunctionPage } from '@/hooks/pages/useNewFunctionPage'
import HoldingRequirements from '@/components/HoldingRequirements'
import BaseContainer from '@/components/Container'
import ExternalLinkButton from '@/components/ExternalLinkButton/cmp'
import InfoTooltipButton from '@/components/InfoTooltipButton/cmp'
import { RuntimeId } from '@/hooks/form/useSelectRuntime'
import SelectInstanceSpecs from '@/components/form/SelectInstanceSpecs'
import AddVolumes from '@/components/form/AddVolumes/cmp'
import AddEnvVars from '@/components/form/AddEnvVars'

const Container = ({ children }: { children: ReactNode }) => (
  <Row xs={1} lg={12} gap="0">
    <Col xs={1} lg={10} lgOffset={2} xl={8} xlOffset={3} xxl={6} xxlOffset={4}>
      <BaseContainer>
        <div tw="max-w-[715px] mx-auto">{children}</div>
      </BaseContainer>
    </Col>
  </Row>
)

export default function NewFunctionPage() {
  const {
    formState,
    handleSubmit,
    setFormValue,
    address,
    accountBalance,
    isCreateButtonDisabled,
    handleChangeEntityTab,
    handleChangeInstanceSpecs,
    handleChangeVolumes,
    handleChangeEnvVars,
  } = useNewFunctionPage()

  const [tabId, setTabId] = useState('code')

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section>
          <pre>{JSON.stringify(formState, null, 2)}</pre>
        </section>
        <section tw="px-0 py-0 md:py-8">
          <Container>
            <Tabs
              selected="function"
              onTabChange={handleChangeEntityTab}
              tabs={[
                {
                  id: 'function',
                  name: 'Function',
                },
                {
                  id: 'instance',
                  name: 'Instance',
                },
                {
                  id: 'confidential',
                  name: 'Confidential',
                  disabled: true,
                  label: 'SOON',
                  labelPosition: 'top',
                },
              ]}
              tw="overflow-auto"
            />
          </Container>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="1">
              Code to execute
            </CompositeTitle>
            <p>
              If your code has any dependencies, you can upload them separately
              in the volume section below to ensure a faster creation.
            </p>
            <div tw="px-0 pt-6 pb-3">
              <Tabs
                selected={tabId}
                align="left"
                tabs={[
                  {
                    id: 'code',
                    name: 'Write code',
                  },
                  {
                    id: 'file',
                    name: 'Upload code',
                  },
                ]}
                onTabChange={(id) => {
                  setTabId(id)
                  setFormValue('codeOrFile', id)
                }}
              />
            </div>
            <div role="tabpanel">
              {tabId === 'code' ? (
                <>
                  <p tw="mb-6">
                    To get started you can start adding your code in the window
                    below.
                  </p>
                  <div tw="mb-6">
                    <NoisyContainer>
                      <RadioGroup direction="row">
                        <Radio
                          checked={formState.codeLanguage === 'python'}
                          label="Python 3.9"
                          name="__config_code_language"
                          onChange={() =>
                            setFormValue('codeLanguage', 'python')
                          }
                          value="on-demand"
                        />
                        <Radio
                          checked={formState.codeLanguage === 'javascript'}
                          label="Node.js"
                          disabled
                          name="__config_code_language"
                          onChange={() =>
                            setFormValue('codeLanguage', 'javascript')
                          }
                          value="persistent"
                        />
                      </RadioGroup>
                    </NoisyContainer>
                  </div>
                  <div>
                    <CodeEditor
                      tw="p-5 rounded-3xl min-h-[415px]"
                      onChange={(value) => setFormValue('functionCode', value)}
                      value={formState.functionCode}
                      defaultLanguage={formState.codeLanguage}
                      language={formState.codeLanguage}
                    />
                  </div>
                  <div tw="mt-6 text-right">
                    <InfoTooltipButton
                      my="bottom-right"
                      at="top-right"
                      tooltipContent={
                        <div tw="text-left">
                          <div>
                            <div className="tp-body2 fs-md">Write code</div>
                            <div className="tp-body1 fs-md">
                              Your code should have an app function that will
                              serve as an entrypoint to the program.
                            </div>
                          </div>
                          <div tw="mt-6">
                            <div className="tp-body2 fs-md">Upload code</div>
                            <div className="tp-body1 fs-md">
                              Your zip file should contain a main file (ex:
                              main.py) at its root that exposes an app function.
                              This will serve as an entrypoint to the program.
                            </div>
                          </div>
                        </div>
                      }
                    >
                      Learn more
                    </InfoTooltipButton>
                  </div>
                </>
              ) : tabId === 'file' ? (
                <>
                  <p tw="mb-2">
                    To get started, compress your code into a zip file and
                    upload it here.
                  </p>
                  <p tw="mb-6">
                    Your zip archive should contain a{' '}
                    <strong tw="font-bold">main</strong> file (ex: main.py) at
                    its root that exposes an <strong tw="font-bold">app</strong>{' '}
                    function. This will serve as an entrypoint to the program
                  </p>
                  <NoisyContainer>
                    <div tw="py-5 text-center">
                      <HiddenFileInput
                        value={formState.functionFile}
                        accept=".zip"
                        onChange={(file) => setFormValue('functionFile', file)}
                      >
                        Upload code <Icon name="arrow-up" tw="ml-4" />
                      </HiddenFileInput>
                    </div>
                  </NoisyContainer>
                </>
              ) : (
                <></>
              )}
            </div>
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="2">
              Select runtime
            </CompositeTitle>
            <p tw="mb-6">
              Select the optimal environment for executing your functions,
              tailored to your specific requirements. Below are the available
              options
            </p>
            <NoisyContainer>
              <RadioGroup direction="column">
                <Radio
                  checked={formState.runtime === RuntimeId.Debian11}
                  label="Official runtime with Debian 11, Python 3.9 & Node.js 14"
                  name="__config_runtime"
                  onChange={() => setFormValue('runtime', RuntimeId.Debian11)}
                  value="default"
                />
                <Radio
                  checked={formState.runtime === RuntimeId.Debian11Bin}
                  label="Official min. runtime for binaries x86_64 (Rust, Go, ...) "
                  name="__config_runtime"
                  onChange={() =>
                    setFormValue('runtime', RuntimeId.Debian11Bin)
                  }
                  value="default"
                />
                <Radio
                  checked={formState.runtime === RuntimeId.Custom}
                  label="Custom runtime"
                  name="__config_runtime"
                  onChange={() => setFormValue('runtime', RuntimeId.Custom)}
                  value="custom"
                />
              </RadioGroup>

              <div
                className={
                  formState.runtime !== RuntimeId.Custom
                    ? 'unavailable-content'
                    : ''
                }
                tw="mt-5"
              >
                <TextInput
                  label="Runtime hash"
                  placeholder={'3335ad270a571b...'}
                  name="__config_runtime_hash"
                  onChange={(e) =>
                    setFormValue('customRuntimeHash', e.target.value)
                  }
                  disabled={formState.runtime !== RuntimeId.Custom}
                  error={
                    formState.customRuntimeHash &&
                    !isValidItemHash(formState.customRuntimeHash)
                      ? { message: 'Invalid hash' }
                      : undefined
                  }
                />
              </div>
            </NoisyContainer>
            <div tw="mt-6 text-right">
              <ExternalLinkButton href="https://docs.aleph.im/computing/runtimes">
                Learn more
              </ExternalLinkButton>
            </div>
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="3">
              Type of scheduling
            </CompositeTitle>
            <p tw="mb-6">
              Configure if this program should be running continuously,
              persistent, or only on-demand in response to a user request or an
              event.
            </p>
            <NoisyContainer>
              <RadioGroup direction="row">
                <Radio
                  checked={formState.isPersistent}
                  label="Persistent"
                  name="__config_runtime_scheduling"
                  onChange={() => setFormValue('isPersistent', true)}
                  value="persistent"
                />
                <Radio
                  checked={!formState.isPersistent}
                  label="On-demand"
                  name="__config_runtime_scheduling"
                  onChange={() => setFormValue('isPersistent', false)}
                  value="on-demand"
                />
              </RadioGroup>
            </NoisyContainer>
            <div tw="mt-6 text-right">
              <ExternalLinkButton href="https://docs.aleph.im/computing/persistent">
                Learn more
              </ExternalLinkButton>
            </div>
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="4">
              Select an instance size
            </CompositeTitle>
            <p tw="mb-6">
              Select the hardware resources allocated to your functions,
              ensuring optimal performance and efficient resource usage tailored
              to your specific needs.
            </p>
            <p tw="mb-6">
              You also get free volume storage with your instance. The free
              storage for on-demand VM is always equal to the amount of RAM,
              whilst the free storage for persistent VM is ten times (10x) the
              amount of RAM.
            </p>
            <SelectInstanceSpecs
              specs={formState.specs}
              onChange={handleChangeInstanceSpecs}
            />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="5">
              Name and tags
            </CompositeTitle>
            <p tw="mb-6">
              Organize and identify your functions more effectively by assigning
              a unique name, obtaining a hash reference, and defining multiple
              tags. This helps streamline your development process and makes it
              easier to manage your web3 functions.
            </p>
            <NoisyContainer>
              <div>
                <div tw="mb-3">
                  <InfoTooltipButton
                    plain
                    my="bottom-left"
                    at="bottom-right"
                    tooltipContent={
                      <div tw="text-left">
                        <div>
                          <div className="tp-body2 fs-md">Function name</div>
                          <div className="tp-body1 fs-md">
                            Assign a descriptive and unique name to your
                            function, allowing you to quickly identify it among
                            others in your application, understand the
                            function&apos;s purpose and improve overall project
                            organisation.
                          </div>
                        </div>
                      </div>
                    }
                  >
                    Function name
                  </InfoTooltipButton>
                </div>
                <TextInput
                  placeholder="Give it a name"
                  error={
                    formState.functionName
                      ? undefined
                      : { message: 'This field is required' }
                  }
                  name="__config_function_name"
                  onChange={(e) => setFormValue('functionName', e.target.value)}
                />
              </div>
              <div tw="mt-4">
                <div tw="mb-3">
                  <InfoTooltipButton
                    plain
                    my="bottom-left"
                    at="bottom-right"
                    tooltipContent={
                      <div tw="text-left">
                        <div>
                          <div className="tp-body2 fs-md">Tags</div>
                          <div className="tp-body1 fs-md">
                            Add relevant tags to categorize your functions based
                            on their functionality, purpose, or any other
                            criteria that provide personal context. Tags enable
                            easy filtering and searching within your project,
                            simplifying management and collaboration.
                          </div>
                        </div>
                      </div>
                    }
                  >
                    Tags
                  </InfoTooltipButton>
                </div>
                <ChipInput
                  placeholder="Tags (press enter to add a new tag)"
                  name="__config_function_tags"
                  value={formState.metaTags}
                  onChange={(val) => {
                    setFormValue('metaTags', val)
                  }}
                />
              </div>
            </NoisyContainer>
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="6">
              Add volumes
            </CompositeTitle>
            <AddVolumes
              volumes={formState.volumes}
              onChange={handleChangeVolumes}
            />
            <div tw="mt-6 text-right">
              <InfoTooltipButton
                my="bottom-right"
                at="top-right"
                tooltipContent={
                  <div tw="text-left">
                    <div>
                      <div className="tp-body2 fs-md">New volume</div>
                      <div className="tp-body1 fs-md">
                        <p>
                          Many Python programs require additional packages
                          beyond those present on the system by default.
                        </p>
                        <p>
                          An immutable volume is a file containing a Squashfs
                          filesystem that can be mounted read-only inside the
                          virtual machine running programs in on-demand or
                          persistent execution modes.
                        </p>
                      </div>
                    </div>
                    <div tw="mt-6">
                      <div className="tp-body2 fs-md">Existing volume</div>
                      <p>
                        If this function uses the same dependencies as another
                        program, you can reference the volume hash to avoid data
                        duplication at no additional cost.
                      </p>
                    </div>
                    <div tw="mt-6">
                      <div className="tp-body2 fs-md">Persistent storage</div>
                      <p>
                        By default function data are flushed on each run. A
                        persistent storage will allow you to persist data on
                        disk.
                      </p>
                    </div>
                  </div>
                }
              >
                Learn more
              </InfoTooltipButton>
            </div>
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="7">
              Define environment variables
            </CompositeTitle>
            <p tw="mb-6">
              Define key-value pairs that act as configuration settings for your
              web3 function. Environment variables offer a convenient and secure
              way to store sensitive information, manage configurations, and
              modify your application&apos;s behaviour without altering the
              source code.
            </p>
            <AddEnvVars
              envVars={formState.envVars}
              onChange={handleChangeEnvVars}
            />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="8" label="(SOON)" disabled>
              Custom domain
            </CompositeTitle>
            <p tw="mb-6" className="unavailable-content">
              Configure a user-friendly domain name for your web3 function,
              providing a more accessible and professional way for users to
              interact with your application.
            </p>
            <NoisyContainer>
              <TextInput
                button={
                  <Button
                    color="main0"
                    kind="neon"
                    size="regular"
                    variant="secondary"
                    disabled
                  >
                    Add
                  </Button>
                }
                buttonStyle="wrapped"
                color="white"
                name="__config_add_domain"
                placeholder="Enter custom domain"
                disabled
              />
            </NoisyContainer>
            <div tw="mt-6 text-right">
              <ExternalLinkButton href="https://docs.aleph.im" disabled>
                Learn more
              </ExternalLinkButton>
            </div>
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
                function is removed. Tokens won’t be locked nor consumed. The
                function will be garbage collected once funds are removed from
                the wallet.
              </p>
            </div>
            <div tw="my-7">
              <HoldingRequirements
                address={address}
                reqs={{
                  type: 'function',
                  number: formState.specs?.cpu || 0,
                  isPersistent: formState.isPersistent,
                }}
                storage={formState.volumes}
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
                Create function
              </Button>
            </div>
          </Container>
        </section>
      </form>
    </>
  )
}
