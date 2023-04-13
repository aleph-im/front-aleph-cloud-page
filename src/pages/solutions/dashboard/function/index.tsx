import { Button, Checkbox, ChipInput, CodeEditor, Icon, Radio, RadioGroup, Table, Tabs, TextGradient, TextInput } from "@aleph-front/aleph-core";
import AutoBreadcrumb from "@/components/AutoBreadcrumb";
import CenteredSection from "@/components/CenteredSection";
import CompositeTitle from "@/components/CompositeTitle";
import NoisyContainer from "@/components/NoisyContainer";
import HiddenFileInput from "@/components/HiddenFileInput";
import { convertBitUnits, getFunctionCost, getFunctionSpecsByComputeUnits, isValidItemHash, humanReadableSize } from "@/helpers/utils";
import { useNewFunctionPage } from "@/hooks/pages/useNewFunctionPage";

export default function NewFunction() {
  const {
    formState,
    functionCost,
    handleSubmit,
    setFormValue,
    setEnvironmentVariable,
    addEnvironmentVariable,
    removeEnvironmentVariable,
    setVolumeType,
    setVolumeValue,
    addVolume,
    removeVolume
  } = useNewFunctionPage()

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section>
          <AutoBreadcrumb name="Setup new function" />
        </section>

        <CenteredSection>
          <CompositeTitle number="1" title="Code to execute" type="h4" color="main1" />

          <p>If your code has any dependency, you can upload them separatly in the volume section below to ensure a faster creation.</p>

          <Tabs align="left" tabs={[
            {
              name: 'Online editor',
              component: (
                <>
                  <div className="py-md">
                    <NoisyContainer>
                      <RadioGroup direction="row">
                        <Radio
                          checked={formState.codeLanguage === "python"}
                          label="Python 3.9"
                          name="__config_code_language"
                          onChange={() => setFormValue('codeLanguage', false)}
                          value="on-demand"
                        />
                        <Radio
                          checked={formState.codeLanguage === "javascript"}
                          label="Node.js"
                          disabled
                          name="__config_code_language"
                          onChange={() => setFormValue('codeLanguage', true)}
                          value="persistent"
                        />
                      </RadioGroup>
                    </NoisyContainer>
                  </div>
                  <div className="py-md">
                    <CodeEditor onChange={value => setFormValue('functionCode', value)}
                      value={formState.functionCode}
                      language="python" />
                  </div>
                </>)
            },
            {
              name: 'Upload code',
              component: (
                <div className="py-md text-center">
                  <p>Please select a zip archive</p>

                  <HiddenFileInput value={formState.functionFile} accept=".zip" onChange={(file) => setFormValue('functionFile', file)}>
                    Upload zip archive <Icon name="arrow-up" className="ml-sm" />
                  </HiddenFileInput>
                </div>
              )
            },
          ]}
            onTabChange={(_from, to) => {
              const codeOrFile = to === 0 ? 'code' : 'file'
              setFormValue('codeOrFile', codeOrFile)
            }} />
        </CenteredSection>

        <CenteredSection>
          <CompositeTitle number="2" title="Choose runtime" type="h4" color="main1" />

          <p>Select the optimal environment for executing your functions tailored to your specific requirements. Below are the available options</p>

          <NoisyContainer>
            <RadioGroup direction="column">
              <Radio
                checked={formState.runtime === 'default_interpreted'}
                label="Official runtime with Debian 11, Python 3.9 & Node.js 14"
                name="__config_runtime"
                onChange={() => setFormValue('runtime', 'default_interpreted')}
                value="default" />
              <Radio
                checked={formState.runtime === 'default_binary'}
                label="Official min. runtime for binaries x86_64 (Rust, Go)"
                name="__config_runtime"
                onChange={() => setFormValue('runtime', 'default_binary')}
                value="default" />
              <Radio
                checked={formState.runtime === 'custom'}
                label="Custom runtime"
                name="__config_runtime"
                onChange={() => setFormValue('runtime', 'custom')}
                value="custom" />
            </RadioGroup>

            <div className={"my-md " + (formState.runtime !== 'custom' ? "unavailable-content" : "")}>
              <TextInput
                label="Runtime hash"
                placeholder={"3335ad270a571b..."}
                name="__config_runtime_hash"
                onChange={e => setFormValue('customRuntimeHash', e.target.value)}
                disabled={formState.runtime !== 'custom'}
                error={
                  (formState.customRuntimeHash && !isValidItemHash(formState.customRuntimeHash)) ? { message: "Invalid hash" } : undefined
                } />
            </div>
          </NoisyContainer>
        </CenteredSection>

        <CenteredSection>
          <CompositeTitle number="3" title="Type of scheduling" type="h4" color="main1" />

          <p>Configure if this program should be running all the time or only on demand in response to a user request or an event.</p>

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
          <CompositeTitle number="4" title="Select an instance size" type="h4" color="main1" />

          <p>Select the hardware resources allocated to your functions, ensuring optimal performance and efficient resource usage tailored to your specific needs.</p>

          <Table
            border="none"
            oddRowNoise
            keySelector={(row: any) => row.cpu}
            columns={[
              {
                label: 'Cores',
                selector: (row: any) => row.cpu,
                cell: (row: any) => (
                  formState.computeUnits === row.cpu ?
                    <TextGradient as="span" type="body">{row.cpu} x86 64bit</TextGradient>
                    : <span>{row.cpu} x86 64bit</span>
                )
              },
              {
                label: 'Memory',
                selector: (row: any) => row.memory,
                cell: (row: any) => (
                  formState.computeUnits === row.cpu ?
                    <TextGradient as="span" type="body">{row.memory}</TextGradient>
                    : <span>{row.memory}</span>
                )
              },
              {
                label: 'Price',
                selector: (row: any) => row.price,
                cell: (row: any) => (
                  formState.computeUnits === row.cpu ?
                    <TextGradient as="span" type="body">{row.price}</TextGradient>
                    : <span>{row.price}</span>
                )
              },
              {
                label: '',
                selector: () => null,
                cell: (row: any) => (
                  formState.computeUnits === row.cpu ?
                    <Button color="main0" variant={"secondary"} kind={"flat"} size={"regular"} disabled>
                      <Icon name="check" />
                    </Button>
                    : <Button color="main0" variant={"secondary"} kind={"flat"} size={"regular"} onClick={() => setFormValue('computeUnits', row.cpu)}>&gt;</Button>
                )
              }
            ]}
            data={
              // TODO: Memoize this
              ([1, 2, 4, 6, 8, 12]
                .map(computeUnits => {
                  const specs = getFunctionSpecsByComputeUnits(computeUnits, formState.isPersistent)
                  const price = getFunctionCost({ capabilities: {}, computeUnits, isPersistent: formState.isPersistent, storage: 0 })

                  return ({
                    cpu: specs.cpu,
                    memory: convertBitUnits(specs.memory, { from: 'mb', to: 'gb', displayUnit: true }),
                    price: price.compute + ' ALEPH'
                  }) as any
                }))
            } />
        </CenteredSection>

        <CenteredSection>
          <CompositeTitle number="5" title="Name and tags" type="h4" color="main1" />
          <p>Organize and identify your functions more effectively by assigning a unique name, obtaining a hash reference, and defining multiple tags. This helps streamline your development process and makes it easier to manage your web3 functions.</p>

          <NoisyContainer>
            <div className="my-md">
              <TextInput
                label="Function name"
                placeholder="Give it a name"
                error={formState.functionName ? undefined : { message: "This field is required" }}
                name="__config_function_name"
                onChange={e => setFormValue('functionName', e.target.value)} />
            </div>

            <div className="my-md">
              <ChipInput
                label="Tags"
                placeholder="Tags (press enter to add a new tag)"
                name="__config_function_tags"
                value={formState.metaTags}
                onChange={val => setFormValue('metaTags', val)} />
            </div>
          </NoisyContainer>
        </CenteredSection>

        <CenteredSection>
          <CompositeTitle number="7" title="Define environment variables" type="h4" color="main1" />

          <p>Define key-value pairs that act as configuration settings for your web3 function. Environment variables offer a convenient and secure way to store sensitive information, manage configurations, and modify your application&apos;s behaviour without altering the source code.</p>

          {formState.environmentVariables.length > 0 &&
            <NoisyContainer>
              {
                formState.environmentVariables.map((variable, index) => (
                  // eslint-disable-next-line react/jsx-key
                  <div className="my-md d-flex flex-jc-sb">
                    <TextInput
                      name={`__config_env_var_${index}_name`}
                      placeholder="Name"
                      value={variable.name}
                      onChange={e => setEnvironmentVariable(index, 'name', e.target.value)} />
                    <TextInput
                      name={`__config_env_var_${index}_value`}
                      placeholder="Value"
                      value={variable.value}
                      onChange={e => setEnvironmentVariable(index, 'value', e.target.value)} />
                    <Button color="main2" variant="secondary" kind="neon" size="regular" type="button" onClick={() => removeEnvironmentVariable(index)}><Icon name="trash" /></Button>
                  </div>
                ))
              }
            </NoisyContainer>
          }

          <div className="my-md">
            <Button type="button" onClick={addEnvironmentVariable} color="main0" variant="secondary" kind="neon" size="regular">
              Add variable
            </Button>
          </div>
        </CenteredSection>

        <CenteredSection className="unavailable-content">
          <CompositeTitle number="8" title="Custom domain" type="h4" color="main1" label="(SOON)" />

          <p>Configure a user-friendly domain name for your web3 function, providing a more accessible and professional way for users to interact with your application.</p>

          <TextInput
            button={<Button color="main0" kind="neon" size="regular" variant="secondary">Use</Button>}
            buttonStyle="stuck"
            color="white"
            name="text-input"
            placeholder="mydomain.com"
            disabled
          />
        </CenteredSection>

        <CenteredSection>
          <CompositeTitle number="9" title="Add volumes" type="h4" color="main1" />
          {formState.volumes.map((volume, iVolume) => (
            <Tabs key={volume.refHash} align="left" tabs={[
              {
                name: 'New volume',
                component: (
                  <div className="my-lg">
                    <p>Create and configure new volumes for your web3 function by either uploading a dependency file or a squashfs volume. Volumes play a crucial role in managing dependencies and providing a volume within your application.</p>

                    <NoisyContainer>
                      <div className="my-md d-flex flex-jc-sb">
                        <HiddenFileInput value={formState.volumes[iVolume].src} onChange={(file) => setVolumeValue(iVolume, 'src', file)}>
                          Upload squashfs volume <Icon name="arrow-up" className="ml-sm" />
                        </HiddenFileInput>

                        <strong>or</strong>

                        <div className="unavailable-content">
                          <HiddenFileInput onChange={(file) => setVolumeValue(iVolume, 'src', file)} accept=".tar.gz, .tgz, .tar, .zip">
                            Upload dependency file <Icon name="arrow-up" className="ml-sm" />
                          </HiddenFileInput>
                        </div>
                      </div>

                      <div className="my-md">
                        <TextInput
                          label="Mount"
                          placeholder="/mount/opt"
                          onChange={e => setVolumeValue(iVolume, 'mountpoint', e.target.value)}
                          value={formState.volumes[iVolume].mountpoint}
                          name={`__config_volume_${iVolume}_mount`} />
                      </div>

                      <div className="my-md">
                        <TextInput
                          label="Size"
                          disabled
                          value={humanReadableSize(formState.volumes[iVolume]?.src?.size)}
                          name={`__config_volume_${iVolume}_size`} />
                      </div>

                      <div className="my-md">
                        <Checkbox
                          label="Use latest version"
                          onChange={e => setVolumeValue(iVolume, 'useLatest', e.target.checked)} />
                      </div>

                      <div className="my-md text-right">
                        <Button type="button" onClick={() => removeVolume(iVolume)} color="main2" variant="secondary" kind="neon" size="regular">
                          Remove
                        </Button>
                      </div>
                    </NoisyContainer>
                  </div>
                )
              },
              {
                name: 'Existing volume',
                component: (
                  <div className="my-lg">
                    <p>Link existing volumes to your web3 function by pasting the reference hash associated with each volume. Volumes are an essential component for managing persistent data storage and dependencies within your application.</p>

                    <NoisyContainer>
                      <div className="my-md">
                        <TextInput
                          label="Mount"
                          placeholder="/mount/opt"
                          onChange={e => setVolumeValue(iVolume, 'mountpoint', e.target.value)}
                          value={formState.volumes[iVolume].mountpoint}
                          name={`__config_volume_${iVolume}_mount`} />
                      </div>

                      <div className="my-md">
                        <TextInput
                          label="Item hash"
                          placeholder="3335ad270a571b..."
                          onChange={e => setVolumeValue(iVolume, 'refHash', e.target.value)}
                          value={formState.volumes[iVolume].refHash}
                          error={
                            (formState.volumes[iVolume].refHash && !isValidItemHash(formState.volumes[iVolume].refHash || '')) ? { message: "Invalid hash" } : undefined
                          }
                          name={`__config_volume_${iVolume}_name`} />
                      </div>

                      <div className="my-md">
                        <Checkbox
                          label="Use latest version"
                          onChange={e => setVolumeValue(iVolume, 'useLatest', e.target.value)} />
                      </div>

                      <div className="my-md text-right">
                        <Button type="button" onClick={() => removeVolume(iVolume)} color="main2" variant="secondary" kind="neon" size="regular">
                          Remove
                        </Button>
                      </div>
                    </NoisyContainer>
                  </div>
                )
              },
              {
                name: 'Persistent storage',
                component: (
                  <div className="my-lg">
                    <p>Create and configure persistent storage for your web3 functions, enabling your application to maintain data across multiple invocations or sessions. You can set up a customized storage solution tailored to your application&apos;s requirements.</p>

                    <NoisyContainer>
                      <div className="my-md">
                        <TextInput
                          label="Volume name"
                          placeholder="Redis volume"
                          onChange={e => setVolumeValue(iVolume, 'name', e.target.value)}
                          value={formState.volumes[iVolume].name}
                          name={`__config_volume_${iVolume}_name`}
                          error={formState.volumes[iVolume].name === "" ? new Error('Please provide a name') : undefined} />
                      </div>

                      <div className="my-md">
                        <TextInput
                          label="Mount"
                          placeholder="/mount/opt"
                          onChange={e => setVolumeValue(iVolume, 'mountpoint', e.target.value)}
                          value={formState.volumes[iVolume].mountpoint}
                          name={`__config_volume_${iVolume}_mount`} />
                      </div>

                      <div className="my-md">
                        <TextInput
                          label="Size (GB)"
                          placeholder="2"
                          onChange={e => setVolumeValue(iVolume, 'size', e.target.value)}
                          value={formState.volumes[iVolume].size}
                          name={`__config_volume_${iVolume}_size`} />
                      </div>

                      <div className="my-md text-right">
                        <Button type="button" onClick={() => removeVolume(iVolume)} color="main2" variant="secondary" kind="neon" size="regular">
                          Remove
                        </Button>
                      </div>
                    </NoisyContainer>
                  </div>
                )
              },
            ]}
              onTabChange={(_fromIndex, toIndex) => setVolumeType(iVolume, toIndex)} />
          ))}

          <Button type="button" onClick={addVolume} color="main0" variant="secondary" kind="neon" size="regular">
            Add volume
          </Button>
        </CenteredSection>

        <section className="fx-noise-light p-md">
          <CenteredSection>
            <TextGradient type="h4">Estimated holding requirements</TextGradient>

            <div className="my-md">
              Compute: {functionCost.compute} Aleph
            </div>

            <div className="my-md">
              Storage: {functionCost.storage} Aleph
            </div>

            <div className="my-md text-center">
              <Button type="submit" color="main0" kind="neon" size="big" variant="primary">Create function</Button>
            </div>
          </CenteredSection>
        </section>
      </form>
    </>
  )
}