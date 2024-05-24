import React from 'react'
import { useSelectWebsiteFramework } from '@/hooks/form/useSelectWebsiteFramework'
import { Dropdown, DropdownOption, TextArea } from '@aleph-front/core'
import { NoisyContainer } from '@aleph-front/core'
//import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import { SelectWebsiteFrameworkProps } from './types'

export const SelectWebsiteFramework = React.memo(
  (props: SelectWebsiteFrameworkProps) => {
    const { frameworkCtrl, options, docs } = useSelectWebsiteFramework(props)

    return (
      <>
        <NoisyContainer>
          <Dropdown
            {...{
              ...frameworkCtrl.field,
              ...frameworkCtrl.fieldState,
              placeholder: 'Choose your framework',
              label: 'Framework',
              required: true,
            }}
          >
            {options.map((option) => (
              <DropdownOption key={option.id} value={option.id}>
                {option.name}
              </DropdownOption>
            ))}
          </Dropdown>
          {docs && (
            <div tw="mt-12">
              {docs?.map((doc, i) => (
                <div key={i} tw="my-4">
                  {doc.type === 'code' ? (
                    <TextArea
                      name="docs"
                      variant="code"
                      value={doc.value}
                      style={{ height: doc.height }}
                      disabled
                    />
                  ) : (
                    <>{doc.value}</>
                  )}
                </div>
              ))}
            </div>
          )}
        </NoisyContainer>
        {/* <div tw="mt-6 text-right">
          <ExternalLinkButton href="https://docs.aleph.im/">
            Learn more
          </ExternalLinkButton>
        </div> */}
      </>
    )
  },
)
SelectWebsiteFramework.displayName = 'SelectWebsiteFramework'

export default SelectWebsiteFramework
