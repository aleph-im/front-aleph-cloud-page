import React from 'react'
import { AddFunctionCodeProps } from './types'
import HiddenFileInput from '@/components/common/HiddenFileInput'
import InfoTooltipButton from '@/components/common/InfoTooltipButton'
import {
  CodeEditor,
  Icon,
  Radio,
  RadioGroup,
  Tabs,
  TextInput,
} from '@aleph-front/aleph-core'
import NoisyContainer from '@/components/common/NoisyContainer'
import { useAddFunctionCode } from '@/hooks/form/useAddFunctionCode'

export const AddFunctionCode = React.memo((props: AddFunctionCodeProps) => {
  const { langCtrl, typeCtrl, textCtrl, fileCtrl, entryPointCtrl } =
    useAddFunctionCode(props)

  return (
    <>
      <div tw="px-0 pt-6 pb-3">
        <Tabs
          selected={typeCtrl.field.value}
          align="left"
          tabs={[
            {
              id: 'text',
              name: 'Write code',
            },
            {
              id: 'file',
              name: 'Upload code',
            },
          ]}
          onTabChange={typeCtrl.field.onChange}
        />
      </div>
      <div role="tabpanel">
        {typeCtrl.field.value === 'text' ? (
          <>
            <p tw="mb-6">
              To get started you can start adding your code in the window below.
            </p>
            <div tw="mb-6">
              <NoisyContainer>
                <RadioGroup
                  {...langCtrl.field}
                  {...langCtrl.fieldState}
                  direction="row"
                >
                  <Radio label="Python 3.9" value="python" />
                  <Radio label="Node.js" value="javascript" disabled />
                </RadioGroup>
              </NoisyContainer>
            </div>
            <div>
              <CodeEditor
                {...textCtrl.field}
                {...textCtrl.fieldState}
                defaultLanguage={langCtrl.field.value}
                language={langCtrl.field.value}
                tw="p-5 rounded-3xl min-h-[415px]"
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
                        Your code should have an app function that will serve as
                        an entrypoint to the program.
                      </div>
                    </div>
                    <div tw="mt-6">
                      <div className="tp-body2 fs-md">Upload code</div>
                      <div className="tp-body1 fs-md">
                        Your zip file should contain a main file (ex: main.py)
                        at its root that exposes an app function. This will
                        serve as an entrypoint to the program.
                      </div>
                    </div>
                  </div>
                }
              >
                Learn more
              </InfoTooltipButton>
            </div>
          </>
        ) : (
          <>
            <p tw="mb-2">
              To get started, compress your code into a zip or squashfs (.sqsh) file and upload it
              here.
            </p>

            <NoisyContainer>
              <div tw="mb-6 py-5 text-center">
                <HiddenFileInput
                  {...fileCtrl.field}
                  {...fileCtrl.fieldState}
                  accept=".zip,.sqsh"
                >
                  Upload code <Icon name="arrow-up" tw="ml-4" />
                </HiddenFileInput>
              </div>
            </NoisyContainer>

            <NoisyContainer tw="mt-6">
              <div>
                <InfoTooltipButton
                  plain
                  my="bottom-left"
                  at="bottom-right"
                  tooltipContent={
                    <div tw="text-left">
                      <div>
                        <div className="tp-body2 fs-md">Entrypoint</div>
                        <div className="tp-body1 fs-md">
                          Define an entrypoint to your program. For example if
                          you have a file called main.py and a function called
                          app, you should enter main:app.
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div tw="my-3">Entry point</div>
                </InfoTooltipButton>
                <TextInput
                  {...entryPointCtrl.field}
                  {...entryPointCtrl.fieldState}
                  placeholder="main:app"
                />
              </div>
            </NoisyContainer>
          </>
        )}
      </div>
    </>
  )
})
AddFunctionCode.displayName = 'AddFunctionCode'

export default AddFunctionCode
