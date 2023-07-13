import { useState } from 'react'
import {
  Button,
  CodeEditor,
  Icon,
  Radio,
  RadioGroup,
  Tabs,
  TextGradient,
} from '@aleph-front/aleph-core'
import CompositeTitle from '@/components/common/CompositeTitle'
import NoisyContainer from '@/components/common/NoisyContainer'
import HiddenFileInput from '@/components/common/HiddenFileInput'
import { useNewFunctionPage } from '@/hooks/pages/dashboard/useNewFunctionPage'
import HoldingRequirements from '@/components/common/HoldingRequirements'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import InfoTooltipButton from '@/components/common/InfoTooltipButton'
import SelectInstanceSpecs from '@/components/form/SelectInstanceSpecs'
import AddVolumes from '@/components/form/AddVolumes'
import AddEnvVars from '@/components/form/AddEnvVars'
import AddDomains from '@/components/form/AddDomains'
import AddNameAndTags from '@/components/form/AddNameAndTags'
import SelectFunctionRuntime from '@/components/form/SelectFunctionRuntime'
import { EntityType } from '@/helpers/constants'
import Container from '@/components/common/CenteredContainer'

export default function NewFunctionPage() {
  const {
    formState,
    handleSubmit,
    setFormValue,
    address,
    accountBalance,
    isCreateButtonDisabled,
    handleChangeEntityTab,
    handleChangeFunctionRuntime,
    handleChangeInstanceSpecs,
    handleChangeVolumes,
    handleChangeEnvVars,
    handleChangeDomains,
    handleChangeNameAndTags,
  } = useNewFunctionPage()

  const [tabId, setTabId] = useState('code')

  return (
    <>
      <form onSubmit={handleSubmit}>
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
                  disabled: true,
                  label: 'SOON',
                  labelPosition: 'top',
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
            <SelectFunctionRuntime
              runtime={formState.runtime}
              onChange={handleChangeFunctionRuntime}
            />
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
              isPersistentVM={formState.isPersistent}
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
            <AddNameAndTags
              entityType={EntityType.Program}
              name={formState.name}
              tags={formState.tags}
              onChange={handleChangeNameAndTags}
            />
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
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="7">
              Add environment variables
            </CompositeTitle>
            <p tw="mb-6">
              Define key-value pairs that act as configuration settings for your
              web3 function. Environment variables offer a convenient way to
              store information, manage configurations, and modify your
              application&apos;s behaviour without altering the source code.
            </p>
            <AddEnvVars
              envVars={formState.envVars}
              onChange={handleChangeEnvVars}
            />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <div className="unavailable-content">
              <CompositeTitle as="h2" number="8" label="(SOON)">
                Custom domain
              </CompositeTitle>
              <p tw="mb-6">
                Configure a user-friendly domain name for your web3 function,
                providing a more accessible and professional way for users to
                interact with your application.
              </p>
              <AddDomains
                domains={formState.domains}
                onChange={handleChangeDomains}
              />
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
                type={EntityType.Program}
                isPersistentVM={formState.isPersistent}
                specs={formState.specs}
                volumes={formState.volumes}
                domains={formState.domains}
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
