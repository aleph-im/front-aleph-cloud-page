import React from 'react'
import {
  CodeEditor,
  FormLabel,
  NoisyContainer,
  Radio,
  RadioGroup,
  Tabs,
  TextInput,
  FileInput,
} from '@aleph-front/core'
import {
  defaultCodeText,
  useAddFunctionCode,
} from '@/hooks/form/useAddFunctionCode'
import { FunctionLangId } from '@/domain/lang'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import InfoTooltipButton from '@/components/common/InfoTooltipButton'
import { AddFunctionCodeProps } from './types'

export const AddFunctionCode = React.memo((props: AddFunctionCodeProps) => {
  const {
    langCtrl,
    typeCtrl,
    textCtrl,
    fileCtrl,
    entryPointCtrl,
    radioDirection,
  } = useAddFunctionCode(props)

  return (
    <>
      <div tw="px-0 pt-6 pb-3">
        <Tabs
          selected={typeCtrl.field.value}
          align="left"
          tabs={[
            {
              id: 'file',
              name: 'Upload code',
            },
            {
              id: 'text',
              name: 'Write code',
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
                  required
                  direction={radioDirection}
                  tw="mb-6"
                >
                  <Radio label="Python 3.9" value={FunctionLangId.Python} />
                  <Radio label="Node.js 18" value={FunctionLangId.Node} />
                  <Radio label="Other" value={FunctionLangId.Other} />
                </RadioGroup>
                <CodeEditor
                  {...textCtrl.field}
                  {...textCtrl.fieldState}
                  required
                  defaultValue={defaultCodeText}
                  defaultLanguage={langCtrl.field.value}
                  language={langCtrl.field.value}
                  tw="p-5 rounded-3xl min-h-[415px]"
                />
              </NoisyContainer>
            </div>
          </>
        ) : (
          <>
            <p tw="mb-6">
              To get started, compress your code into a zip or squashfs (.sqsh)
              file and upload it here.
            </p>
            <NoisyContainer>
              <div tw="mb-10">
                <RadioGroup
                  {...langCtrl.field}
                  {...langCtrl.fieldState}
                  required
                  label="Language"
                  direction={radioDirection}
                >
                  <Radio label="Python 3.9" value={FunctionLangId.Python} />
                  <Radio label="Node.js 18" value={FunctionLangId.Node} />
                  <Radio label="Other" value={FunctionLangId.Other} />
                </RadioGroup>
              </div>
              <div tw="mb-10">
                <InfoTooltipButton
                  plain
                  my="top-left"
                  at="top-right"
                  vAlign="top"
                  tooltipContent={
                    <div className="text-left tp-body1 fs-18">
                      <div tw="mb-10">
                        The entry point is the name of the script or file used
                        to invoke your function. It&apos;s essentially the
                        &apos;doorway&apos; to your code.
                      </div>
                      <div>
                        <div>Examples:</div>
                        <ul tw="list-disc pl-6">
                          <li>
                            <strong>Python:</strong> If you have a function
                            named &apos;app&apos; in a file called
                            &apos;main.py&apos;, your entry point would be
                            main:app
                          </li>
                          <li>
                            <strong>Node.js:</strong> If your primary file is
                            &apos;index.js&apos;, then your entry point is
                            simply index.js
                          </li>
                        </ul>
                      </div>
                      <div tw="mt-10">
                        Different languages and frameworks may have unique
                        conventions. Always refer to your language&apos;s
                        documentation or the specific framework&apos;s guidance
                        to determine the appropriate entry point for your code.
                      </div>
                    </div>
                  }
                >
                  <FormLabel label="Define an entry point" required />
                </InfoTooltipButton>
                <TextInput
                  {...entryPointCtrl.field}
                  {...entryPointCtrl.fieldState}
                  required
                  placeholder="main:app, index.js, ..."
                />
              </div>
              <div>
                <FileInput
                  {...fileCtrl.field}
                  {...fileCtrl.fieldState}
                  required
                  label="Upload your code"
                  accept=".zip,.sqsh"
                />
              </div>
            </NoisyContainer>
          </>
        )}
        <div tw="mt-6 text-right">
          <ExternalLinkButton href="https://docs.aleph.im/tools/webconsole/">
            Learn more
          </ExternalLinkButton>
        </div>
      </div>
    </>
  )
})
AddFunctionCode.displayName = 'AddFunctionCode'

export default AddFunctionCode
