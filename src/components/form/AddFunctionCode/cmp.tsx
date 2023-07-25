import React, { useId } from 'react'
import { AddFunctionCodeProps } from './types'
import HiddenFileInput from '@/components/common/HiddenFileInput'
import InfoTooltipButton from '@/components/common/InfoTooltipButton'
import {
  CodeEditor,
  Icon,
  Radio,
  RadioGroup,
  Tabs,
} from '@aleph-front/aleph-core'
import NoisyContainer from '@/components/common/NoisyContainer'
import { useAddFunctionCode } from '@/hooks/form/useAddFunctionCode'

export const AddFunctionCode = React.memo((props: AddFunctionCodeProps) => {
  const {
    tab,
    code,
    codeFile,
    codeString,
    handleTabChange,
    handleCodeFileChange,
    handleCodeStringChange,
    handleCodeLanguageChange,
  } = useAddFunctionCode(props)
  const id = useId()

  return (
    <>
      <div tw="px-0 pt-6 pb-3">
        <Tabs
          selected={tab}
          align="left"
          tabs={[
            {
              id: 'string',
              name: 'Write code',
            },
            {
              id: 'file',
              name: 'Upload code',
            },
          ]}
          onTabChange={handleTabChange}
        />
      </div>
      <div role="tabpanel">
        {tab === 'string' ? (
          <>
            <p tw="mb-6">
              To get started you can start adding your code in the window below.
            </p>
            <div tw="mb-6">
              <NoisyContainer>
                <RadioGroup
                  value={code.lang}
                  onChange={handleCodeLanguageChange}
                  direction="row"
                >
                  <Radio label="Python 3.9" value="python" name={id} />
                  <Radio
                    label="Node.js"
                    value="javascript"
                    name={id}
                    disabled
                  />
                </RadioGroup>
              </NoisyContainer>
            </div>
            <div>
              <CodeEditor
                tw="p-5 rounded-3xl min-h-[415px]"
                value={codeString}
                onChange={handleCodeStringChange}
                defaultLanguage={code.lang}
                language={code.lang}
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
        ) : tab === 'file' ? (
          <>
            <p tw="mb-2">
              To get started, compress your code into a zip file and upload it
              here.
            </p>
            <p tw="mb-6">
              Your zip archive should contain a{' '}
              <strong tw="font-bold">main</strong> file (ex: main.py) at its
              root that exposes an <strong tw="font-bold">app</strong> function.
              This will serve as an entrypoint to the program
            </p>
            <NoisyContainer>
              <div tw="py-5 text-center">
                <HiddenFileInput
                  accept=".zip"
                  value={codeFile}
                  onChange={handleCodeFileChange}
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
    </>
  )
})
AddFunctionCode.displayName = 'AddFunctionCode'

export default AddFunctionCode
