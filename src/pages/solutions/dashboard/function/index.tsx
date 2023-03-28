import { Button, ChipInput, CodeEditor, Icon, Radio, RadioGroup, Table, Tabs, TextGradient, TextInput } from "@aleph-front/aleph-core";

import AutoBreadcrumb from "@/components/AutoBreadcrumb";
import CenteredSection from "@/components/CenteredSection";
import CompositeTitle from "@/components/CompositeTitle";
import NoisyContainer from "@/components/NoisyContainer";
import useConnected from "@/helpers/hooks/useConnected";
import { FormEvent, useContext, useMemo, useReducer } from "react";
import { displayVolumesToAlephVolumes, FormState, initialFormState, runtimeRefs, Volume, VolumeTypes } from "./form";
import { getFunctionCost, isValidItemHash } from "@/helpers/utils";
import { createFunctionProgram } from "@/helpers/aleph";
import { AppStateContext } from "@/pages/_app";
import JSZip from "jszip";
import HiddenFileInput from "@/components/HiddenFileInput";

export default function Home( ) { 
  useConnected()
  const [ globalState, dispatchGlobal ] = useContext(AppStateContext)

  const [formState, dispatchForm] = useReducer( (state: FormState, action: { type: string, payload: any}): FormState => {
    switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    
    default:
      return state
  }
  }, initialFormState)

  const setFormValue = (name: string, value: any) => (
    dispatchForm({ type: 'SET_VALUE', payload: { name, value } })
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    let file
    if(formState.codeOrFile === "code"){
      const jsZip = new JSZip()
      jsZip.file("main.py", formState.functionCode || '')
      const zip = await jsZip.generateAsync({ type: "blob" })
      file = new File([zip], "main.py.zip", { type: "application/zip" })
    }
    else if(formState.codeOrFile === "file" && formState.functionFile !== undefined){
      file = formState.functionFile
    }
    else {
      return alert("Invalid code or file")
    }

    let runtime = formState.customRuntimeHash
    if(formState.runtime !== 'custom'){
      runtime = runtimeRefs[formState.runtime]
    }

    if(!isValidItemHash(runtime || ''))
      return alert("Invalid runtime hash")

    try{
      const msg = await createFunctionProgram({
        // @ts-ignore
        account: globalState.account,
        name: formState.functionName.trim() || 'Untitled function',
        isPersistent: formState.isPersistent,
        file,
        runtime, // FIXME: lazy initialisation is a shitty pattern
        volumes: displayVolumesToAlephVolumes(formState.volumes), // TODO: Volumes
        entrypoint: 'main:app', // TODO: Entrypoint
        computeUnits: formState.computeUnits
      })
      alert('function created')
    }
    catch(err){
      console.error(err)
      alert("Error")
    }
  }

  const addVolume = () => {
    setFormValue('volumes', [...formState.volumes, {
      size: 2,
    }])
  }

  const removeVolume = (volumeIndex: number) => {
    setFormValue('volumes', formState.volumes.filter((_, i) => i !== volumeIndex))
  }

  const setVolumeType = (volumeIndex:number, volumeType:number) => {
    const volumeTypes: VolumeTypes[] = ['new', 'existing', 'persistent']
    const volumes = [... formState.volumes]

    volumes[volumeIndex] = {
      ...volumes[volumeIndex],
      type: volumeTypes[volumeType]
    }
    setFormValue('volumes', volumes)
  }

  const setVolumeValue = (volumeIndex:number, volumekey:string, volumeValue: string) => {
    const volumes = [... formState.volumes]
    volumes[volumeIndex] = {
      ...volumes[volumeIndex],
      [volumekey]: volumeValue
    }

    setFormValue('volumes', volumes)
  }

  const functionCost = useMemo(() => 
    getFunctionCost({
      computeUnits: formState.computeUnits,
      isPersistent: formState.isPersistent,
      storage: formState.volumes.reduce((acc: number, volume: Volume) => {
        if(volume.type === 'new' || volume.type === 'persistent'){
          return acc + (volume.size || 0) * 1024 
        }
        return acc
      }, 0),
      capabilities: {
        internetAccess: true,
        blockchainRPC: false,
        enableSnapshots: false,
      }
    })
  , [formState.volumes, formState.computeUnits, formState.isPersistent])

  return (
    <>
      <form onSubmit={handleSubmit}>
      <section>
        <AutoBreadcrumb name="Setup new function" />
      </section>

      <CenteredSection>
        <CompositeTitle number="1" title="Code to execute" type="h4" color="main1" />
        <Tabs tabs={[
          {
            name : 'Online editor', 
            component: (
              <div className="py-md">
                <CodeEditor onChange={value => setFormValue('functionCode', value)} 
                            value={formState.functionCode}
                            language="python" />
              </div>
            )
          },
          {
            name : 'Upload code', 
            component: (
              <div className="py-md text-center">
                <p>Please select a zip archive</p>

                <HiddenFileInput accept=".zip" onChange={(e) => setFormValue('functionFile', e.target.files?.[0])}>
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
          <NoisyContainer>
            <RadioGroup direction="column">
              <Radio
                checked={formState.runtime === 'default_interpreted'}
                label="Official Aleph runtime with Python 3.8 & Node.js 14"
                name="__config_runtime"
                onChange={() => setFormValue('runtime', 'default_interpreted')}
                value="default" />
              <Radio
                checked={formState.runtime === 'default_binary'}
                label="Official Aleph runtime for binary executables"
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
                  (formState.customRuntimeHash && !isValidItemHash(formState.customRuntimeHash)) ? {message: "Invalid hash"} : undefined
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

        <Table 
          border="none"
          oddRowNoise
          keySelector={row => row.cpu}
          columns={[
            {
              label: 'Cores',
              selector: row => row.cpu,
              cell: row => (
                formState.computeUnits === row.cpu ? 
                <TextGradient as="span" type="body">{row.cpu} x86 64bit</TextGradient>
                : <span>{row.cpu} x86 64bit</span>
              )
            },
            {
              label: 'Memory',
              selector: row => row.memory,
              cell: row => (
                formState.computeUnits === row.cpu ? 
                <TextGradient as="span" type="body">{row.memory}</TextGradient>
                : <span>{row.memory}</span>
              )
            },
            {
              label: 'Price',
              selector: row => row.price,
              cell: row => (
                formState.computeUnits === row.cpu ?
                <TextGradient as="span" type="body">{row.price}</TextGradient>
                : <span>{row.price}</span>
              )
            },
            {
              label: '',
              selector: () => null,
              cell: (row) => (
                formState.computeUnits === row.cpu ?
                <Button color="main0" variant={"secondary"} kind={"flat"} size={"regular"} disabled>
                  <Icon name="check" />
                </Button>
                : <Button color="main0" variant={"secondary"} kind={"flat"} size={"regular"} onClick={() => setFormValue('computeUnits', row.cpu)}>&gt;</Button>
              )
            }
          ]}
          data={[
            { cpu: 1, memory: '2gb', price: '2000 Aleph' },
            { cpu: 2, memory: '4gb', price: '4000 Aleph' },
            { cpu: 4, memory: '8gb', price: '8000 Aleph' },
          ]} />
      </CenteredSection>

      <CenteredSection>
        <CompositeTitle number="5" title="Name and tags" type="h4" color="main1" />

        <NoisyContainer>
          <div className="my-md">
            <TextInput 
              label="Function name" 
              placeholder="Give it a name"
              error={formState.functionName ? undefined : {message: "This field is required"}}
              name="__config_function_name"
              onChange={e => setFormValue('functionName', e.target.value)} />
          </div>

          <div className="my-md">
            <ChipInput label="Examples of use" placeholder="Tags (press enter to add a new tag)" />
          </div>
        </NoisyContainer>
      </CenteredSection>

      <CenteredSection className="unavailable-content">
        <CompositeTitle number="6" title="Custom domain" type="h4" color="main1" label="(SOON)" />

        <p>Configure a custom domain for your function (coming soon)</p>

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
        <CompositeTitle number="7" title="Add volumes" type="h4" color="main1" />
        { formState.volumes.map((volume, iVolume) => (
            <Tabs tabs={[
              { 
                name: 'New volume', 
                component: (
                  <div className="my-lg">
                    <NoisyContainer>
                      <div className="my-md">
                        <HiddenFileInput onChange={(e) => setVolumeValue(iVolume, 'src', e.target.files?.[0])} accept=".squashfs">
                          Upload squashfs volume <Icon name="arrow-up" className="ml-sm" />
                        </HiddenFileInput>
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
              { 
                name: 'Existing volume', 
                component: (
                <div className="my-lg">
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
                          (formState.volumes[iVolume].refHash && !isValidItemHash(formState.volumes[iVolume].refHash || '')) ? {message: "Invalid hash"} : undefined
                        }
                        name={`__config_volume_${iVolume}_name`} />
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
                  <NoisyContainer>
                    <div className="my-md">
                      <TextInput 
                        label="Volume name" 
                        placeholder="Redis volume"
                        onChange={e => setVolumeValue(iVolume, 'name', e.target.value)}
                        value={formState.volumes[iVolume].name}
                        name={`__config_volume_${iVolume}_name`}
                        error={formState.volumes[iVolume].name === "" && {message: "Please provide a name"}} />
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
        )) }

        <Button type="button" onClick={addVolume} color="main0" variant="secondary" kind="neon" size="regular">
          Add volume
        </Button>
      </CenteredSection>

      <section className="fx-noise-light p-md">
        <CenteredSection>
          <TextGradient type="h4">Estimated holding requirements</TextGradient>

          <div className="my-md">
            Compute: { functionCost.compute } Aleph
          </div>

          <div className="my-md">
            Storage: { functionCost.storage } Aleph
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