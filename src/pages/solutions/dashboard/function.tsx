import {
  Button,
  ChipInput,
  CodeEditor,
  Icon,
  Radio,
  RadioGroup,
  Table,
  Tabs,
  TextGradient,
  TextInput,
} from '@aleph-front/aleph-core'
import AutoBreadcrumb from '@/components/AutoBreadcrumb'
import CenteredSection from '@/components/CenteredSection'
import CompositeTitle from '@/components/CompositeTitle'
import NoisyContainer from '@/components/NoisyContainer'
import HiddenFileInput from '@/components/HiddenFileInput'
import {
  convertBitUnits,
  getFunctionCost,
  getFunctionSpecsByComputeUnits,
  isValidItemHash,
} from '@/helpers/utils'
import { useNewFunctionPage } from '@/hooks/pages/useNewFunctionPage'
import NewVolume from '@/components/NewVolume/cmp'
import HoldingRequirements from '@/components/HoldingRequirements'
import ExternalLink from '@/components/ExternalLink'
import { useState } from 'react'

export default function NewFunctionPage() {
  const {
    formState,
    handleSubmit,
    setFormValue,
    setEnvironmentVariable,
    addEnvironmentVariable,
    removeEnvironmentVariable,
    setVolumeType,
    setVolumeValue,
    addVolume,
    removeVolume,
    address,
    accountBalance,
  } = useNewFunctionPage()

  const [tabId, setTabId] = useState('code')

  return (
    <>
      <section tw="py-6">
        <AutoBreadcrumb name="Setup new function" />
      </section>

      <form onSubmit={handleSubmit}>
        <CenteredSection>
          <CompositeTitle
            number="1"
            title="Code to execute"
            type="h4"
            color="main1"
          />

          <p>
            If your code has any dependency, you can upload them separatly in
            the volume section below to ensure a faster creation.
          </p>

          <Tabs
            selected={tabId}
            align="left"
            tabs={[
              {
                id: 'code',
                name: 'Online editor',
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
          <div role="tabpanel" tw="p-10">
            {tabId === 'code' ? (
              <>
                <div tw="py-5">
                  <NoisyContainer>
                    <RadioGroup direction="row">
                      <Radio
                        checked={formState.codeLanguage === 'python'}
                        label="Python 3.9"
                        name="__config_code_language"
                        onChange={() => setFormValue('codeLanguage', false)}
                        value="on-demand"
                      />
                      <Radio
                        checked={formState.codeLanguage === 'javascript'}
                        label="Node.js"
                        disabled
                        name="__config_code_language"
                        onChange={() => setFormValue('codeLanguage', true)}
                        value="persistent"
                      />
                    </RadioGroup>
                  </NoisyContainer>
                </div>
                <div tw="py-5">
                  <CodeEditor
                    onChange={(value) => setFormValue('functionCode', value)}
                    value={formState.functionCode}
                    language="python"
                  />
                </div>
              </>
            ) : tabId === 'file' ? (
              <div tw="py-5 text-center">
                <p>Please select a zip archive</p>

                <HiddenFileInput
                  value={formState.functionFile}
                  accept=".zip"
                  onChange={(file) => setFormValue('functionFile', file)}
                >
                  Upload zip archive <Icon name="arrow-up" tw="ml-4" />
                </HiddenFileInput>

                <p tw="my-5">
                  Your zip archive should contain a{' '}
                  <strong tw="font-bold">main</strong> file (ex: main.py) at its
                  root that exposes an <strong tw="font-bold">app</strong>{' '}
                  function. This will serve as an entrypoint to the program
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </CenteredSection>

        <CenteredSection>
          <CompositeTitle
            number="2"
            title="Choose runtime"
            type="h4"
            color="main1"
          />

          <p>
            Select the optimal environment for executing your functions tailored
            to your specific requirements. Below are the available options
          </p>

          <NoisyContainer>
            <RadioGroup direction="column">
              <Radio
                checked={formState.runtime === 'default_interpreted'}
                label="Official runtime with Debian 11, Python 3.9 & Node.js 14"
                name="__config_runtime"
                onChange={() => setFormValue('runtime', 'default_interpreted')}
                value="default"
              />
              <Radio
                checked={formState.runtime === 'default_binary'}
                label="Official min. runtime for binaries x86_64 (Rust, Go)"
                name="__config_runtime"
                onChange={() => setFormValue('runtime', 'default_binary')}
                value="default"
              />
              <Radio
                checked={formState.runtime === 'custom'}
                label="Custom runtime"
                name="__config_runtime"
                onChange={() => setFormValue('runtime', 'custom')}
                value="custom"
              />
            </RadioGroup>

            <div
              className={
                formState.runtime !== 'custom' ? 'unavailable-content' : ''
              }
              tw="my-5"
            >
              <TextInput
                label="Runtime hash"
                placeholder={'3335ad270a571b...'}
                name="__config_runtime_hash"
                onChange={(e) =>
                  setFormValue('customRuntimeHash', e.target.value)
                }
                disabled={formState.runtime !== 'custom'}
                error={
                  formState.customRuntimeHash &&
                  !isValidItemHash(formState.customRuntimeHash)
                    ? { message: 'Invalid hash' }
                    : undefined
                }
              />
            </div>
          </NoisyContainer>
        </CenteredSection>

        <CenteredSection>
          <CompositeTitle
            number="3"
            title="Type of scheduling"
            type="h4"
            color="main1"
          />

          <p>
            Configure if this program should be running all the time or only on
            demand in response to a user request or an event.
          </p>

          <NoisyContainer>
            <RadioGroup direction="row">
              <Radio
                checked={!formState.isPersistent}
                label="On demand"
                name="__config_runtime_scheduling"
                onChange={() => setFormValue('isPersistent', false)}
                value="on-demand"
              />
              <Radio
                checked={formState.isPersistent}
                label="Persistent"
                name="__config_runtime_scheduling"
                onChange={() => setFormValue('isPersistent', true)}
                value="persistent"
              />
            </RadioGroup>
          </NoisyContainer>
        </CenteredSection>

        <CenteredSection>
          <CompositeTitle
            number="4"
            title="Select an instance size"
            type="h4"
            color="main1"
          />

          <p>
            Select the hardware resources allocated to your functions, ensuring
            optimal performance and efficient resource usage tailored to your
            specific needs.
          </p>

          <Table
            borderType="none"
            oddRowNoise
            keySelector={(row: any) => row.cpu}
            columns={[
              {
                label: 'Cores',
                selector: (row: any) => row.cpu,
                cell: (row: any) =>
                  formState.computeUnits === row.cpu ? (
                    <TextGradient as="span" type="body">
                      {row.cpu} x86 64bit
                    </TextGradient>
                  ) : (
                    <span>{row.cpu} x86 64bit</span>
                  ),
              },
              {
                label: 'Memory',
                selector: (row: any) => row.memory,
                cell: (row: any) =>
                  formState.computeUnits === row.cpu ? (
                    <TextGradient as="span" type="body">
                      {row.memory}
                    </TextGradient>
                  ) : (
                    <span>{row.memory}</span>
                  ),
              },
              {
                label: 'Price',
                selector: (row: any) => row.price,
                cell: (row: any) =>
                  formState.computeUnits === row.cpu ? (
                    <TextGradient as="span" type="body">
                      {row.price}
                    </TextGradient>
                  ) : (
                    <span>{row.price}</span>
                  ),
              },
              {
                label: '',
                selector: () => null,
                cell: (row: any) =>
                  formState.computeUnits === row.cpu ? (
                    <Button
                      color="main0"
                      variant={'secondary'}
                      kind={'flat'}
                      size={'regular'}
                      disabled
                    >
                      <Icon name="check" />
                    </Button>
                  ) : (
                    <Button
                      color="main0"
                      variant={'secondary'}
                      kind={'flat'}
                      size={'regular'}
                      forwardedAs={'button'}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setFormValue('computeUnits', row.cpu)
                      }}
                    >
                      &gt;
                    </Button>
                  ),
              },
            ]}
            data={
              // TODO: Memoize this
              [1, 2, 4, 6, 8, 12].map((computeUnits) => {
                const specs = getFunctionSpecsByComputeUnits(
                  computeUnits,
                  formState.isPersistent,
                )
                const price = getFunctionCost({
                  capabilities: {},
                  computeUnits,
                  isPersistent: formState.isPersistent,
                })

                return {
                  cpu: specs.cpu,
                  memory: convertBitUnits(specs.memory, {
                    from: 'mb',
                    to: 'gb',
                    displayUnit: true,
                  }),
                  price: price.compute + ' ALEPH',
                } as any
              })
            }
          />
        </CenteredSection>

        <CenteredSection>
          <CompositeTitle
            number="5"
            title="Name and tags"
            type="h4"
            color="main1"
          />
          <p>
            Organize and identify your functions more effectively by assigning a
            unique name, obtaining a hash reference, and defining multiple tags.
            This helps streamline your development process and makes it easier
            to manage your web3 functions.
          </p>

          <NoisyContainer>
            <div tw="my-5">
              <TextInput
                label="Function name"
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

            <div tw="my-5">
              <ChipInput
                label="Tags"
                placeholder="Tags (press enter to add a new tag)"
                name="__config_function_tags"
                value={formState.metaTags}
                onChange={(val) => setFormValue('metaTags', val)}
              />
            </div>
          </NoisyContainer>
        </CenteredSection>

        <CenteredSection>
          <CompositeTitle
            number="7"
            title="Define environment variables"
            type="h4"
            color="main1"
          />

          <p>
            Define key-value pairs that act as configuration settings for your
            web3 function. Environment variables offer a convenient and secure
            way to store sensitive information, manage configurations, and
            modify your application&apos;s behaviour without altering the source
            code.
          </p>

          {formState.environmentVariables.length > 0 && (
            <NoisyContainer>
              {formState.environmentVariables.map((variable, index) => (
                // eslint-disable-next-line react/jsx-key
                <div tw="flex justify-between my-5">
                  <TextInput
                    name={`__config_env_var_${index}_name`}
                    placeholder="Name"
                    value={variable.name}
                    onChange={(e) =>
                      setEnvironmentVariable(index, 'name', e.target.value)
                    }
                  />
                  <TextInput
                    name={`__config_env_var_${index}_value`}
                    placeholder="Value"
                    value={variable.value}
                    onChange={(e) =>
                      setEnvironmentVariable(index, 'value', e.target.value)
                    }
                  />
                  <Button
                    color="main2"
                    variant="secondary"
                    kind="neon"
                    size="regular"
                    type="button"
                    onClick={() => removeEnvironmentVariable(index)}
                  >
                    <Icon name="trash" />
                  </Button>
                </div>
              ))}
            </NoisyContainer>
          )}

          <div tw="my-5">
            <Button
              type="button"
              onClick={addEnvironmentVariable}
              color="main0"
              variant="secondary"
              kind="neon"
              size="regular"
            >
              Add variable
            </Button>
          </div>
        </CenteredSection>

        <CenteredSection className="unavailable-content">
          <CompositeTitle
            number="8"
            title="Custom domain"
            type="h4"
            color="main1"
            label="(SOON)"
          />

          <p>
            Configure a user-friendly domain name for your web3 function,
            providing a more accessible and professional way for users to
            interact with your application.
          </p>

          <TextInput
            button={
              <Button
                color="main0"
                kind="neon"
                size="regular"
                variant="secondary"
              >
                Use
              </Button>
            }
            buttonStyle="stuck"
            color="white"
            name="text-input"
            placeholder="mydomain.com"
            disabled
          />
        </CenteredSection>

        <CenteredSection>
          <CompositeTitle
            number="9"
            title="Add volumes"
            type="h4"
            color="main1"
          />
          {formState.volumes.map((volume, iVolume) => (
            <NewVolume
              key={iVolume} // note: this key is meant to avoid a warning, and should work since the array is not reordered
              volumeMountpoint={volume.mountpoint}
              volumeName={volume.name}
              volumeSize={volume.size}
              volumeSrc={volume.src}
              volumeUseLatest={volume.useLatest}
              volumeRefHash={volume.refHash}
              handleMountpointChange={(e) =>
                setVolumeValue(iVolume, 'mountpoint', e.target.value)
              }
              handleNameChange={(e) =>
                setVolumeValue(iVolume, 'name', e.target.value)
              }
              handleSizeChange={(e) =>
                setVolumeValue(iVolume, 'size', e.target.value)
              }
              handleSrcChange={(e) => setVolumeValue(iVolume, 'src', e)}
              handleRefHashChange={(e) =>
                setVolumeValue(iVolume, 'refHash', e.target.value)
              }
              handleUseLatestChange={(e) =>
                setVolumeValue(iVolume, 'useLatest', e.target.checked)
              }
              removeCallback={() => removeVolume(iVolume)}
              handleVolumeType={(i) => setVolumeType(iVolume, i)}
            />
          ))}

          <Button
            type="button"
            onClick={addVolume}
            color="main0"
            variant="secondary"
            kind="neon"
            size="regular"
          >
            Add volume
          </Button>
        </CenteredSection>

        <section className="fx-noise-light" tw="p-5">
          <CenteredSection>
            <TextGradient type="h4">
              Estimated holding requirements
            </TextGradient>
            <div tw="my-5">
              <TextGradient color="main2" type="body">
                This amount needs to be present in your wallet until the
                function is removed. Tokens won &#39;t be locked nor consumed.
                The function will be garbage collected once funds are removed
                from the wallet.
              </TextGradient>
              <ExternalLink
                href="https://aleph.im"
                text="Learn about the benefits"
              />
            </div>

            <div tw="my-7">
              <HoldingRequirements
                address={address}
                computeUnits={{
                  type: 'function',
                  number: formState.computeUnits,
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
              >
                Create function
              </Button>
            </div>
          </CenteredSection>
        </section>
      </form>
    </>
  )
}
