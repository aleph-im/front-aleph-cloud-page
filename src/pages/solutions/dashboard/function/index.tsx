import { Button, ChipInput, CodeEditor, Radio, RadioGroup, Tabs, TextGradient, TextInput } from "@aleph-front/aleph-core";

import AutoBreadcrumb from "@/components/AutoBreadcrumb";
import CenteredSection from "@/components/CenteredSection";
import CompositeTitle from "@/components/CompositeTitle";
import NoisyContainer from "@/components/NoisyContainer";
import useConnected from "@/helpers/hooks/useConnected";
import { FormEvent, useContext, useReducer, useRef } from "react";
import { FormState, initialFormState, runtimeRefs } from "./form";
import { isValidItemHash } from "@/helpers/utils";
import { createFunctionProgram } from "@/helpers/aleph";
import { AppStateContext } from "@/pages/_app";
import JSZip from "jszip";

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
        volumes: [], // TODO: Volumes
        entrypoint: 'main:app', // TODO: Entrypoint
        computeUnits: 1 // TODO: Compute units
      })
      alert('function created')
    }
    catch(err){
      console.error(err)
      alert("Error")
    }
  }

  const addVolume = (e: FormEvent) => {
    e.preventDefault()
    setFormValue('volumes', [...formState.volumes, {}])
  }

  const removeVolume = (e: FormEvent, index: number) => {
    e.preventDefault()
    setFormValue('volumes', formState.volumes.filter((_, i) => i !== index))
  }

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
                            value={formState.functionCode} />
              </div>
            )
          },
          {
            name : 'Upload code', 
            component: (
              <div className="py-md text-center">
                <p>Please select a zip archive</p>

                <input 
                  type="file"
                  accept=".zip"
                  onChange={(e) => setFormValue('functionFile', e.target.files?.[0])} />
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
        <CompositeTitle number="4" title="Name and tags" type="h4" color="main1" />

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
        <CompositeTitle number="5" title="Custom domain" type="h4" color="main1" label="(SOON)" />

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
        <CompositeTitle number="6" title="Add volumes" type="h4" color="main1" />
        { formState.volumes.map((volume, iVolume) => (
            <Tabs tabs={[
              { 
                name: 'New volume', 
                component: (
                  <div className="my-lg">
                    <NoisyContainer>
                      <div className="my-md">
                        <Button type="button" color="main0" kind="neon" size="regular" variant="primary">Upload squashfs volume</Button>
                      </div>

                      <div className="my-md">
                        <TextInput 
                          label="Mount" 
                          placeholder="/mount/opt"
                          name="__config_volume_mount" />
                      </div>

                      <div className="my-md">
                        <TextInput 
                        label="Size (GB)"
                        placeholder="2"
                        name="__config_volume_size" />
                      </div>

                      <div className="my-md text-right">
                        <Button type="button" onClick={e => removeVolume(e, iVolume)} color="main2" variant="secondary" kind="neon" size="regular">
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
                        name="__config_volume_mount" />
                    </div>

                    <div className="my-md">
                      <TextInput 
                        label="Item hash" 
                        placeholder="3335ad270a571b..."
                        name="__config_volume_name" />
                    </div>
                    
                    <div className="my-md text-right">
                      <Button type="button" onClick={e => removeVolume(e, iVolume)} color="main2" variant="secondary" kind="neon" size="regular">
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
                        label="Size (GB)"
                        placeholder="2"
                        name="__config_volume_size" />
                    </div>

                    <div className="my-md">
                      <TextInput 
                        label="Mount" 
                        placeholder="/mount/opt"
                        name="__config_volume_mount" />
                    </div>

                    <div className="my-md">
                      <TextInput 
                        label="Volume name" 
                        placeholder="Redis volume"
                        name="__config_volume_name" />
                    </div>
                    
                    <div className="my-md text-right">
                      <Button type="button" onClick={e => removeVolume(e, iVolume)} color="main2" variant="secondary" kind="neon" size="regular">
                        Remove
                      </Button>
                    </div>
                  </NoisyContainer>
                </div> 
                )
              },
            ]} />
        )) }

        <Button type="button" onClick={addVolume} color="main0" variant="secondary" kind="neon" size="regular">
          Add volume
        </Button>
      </CenteredSection>

      <section className="fx-noise-light p-md">
        <CenteredSection>
          <TextGradient type="h4">Estimated holding requirements</TextGradient>
          
          <div className="my-md text-center">
            <Button type="submit" color="main0" kind="neon" size="big" variant="primary">Create function</Button>
          </div>
        </CenteredSection>
      </section>
      </form>
    </>
  )
}