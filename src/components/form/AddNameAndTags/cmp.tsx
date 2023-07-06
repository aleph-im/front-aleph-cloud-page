import React from 'react'
import { TextInput, ChipInput } from '@aleph-front/aleph-core'
import { useAddNameAndTags } from '@/hooks/form/useAddNameAndTags'
import InfoTooltipButton from '@/components/common/InfoTooltipButton'
import NoisyContainer from '@/components/common/NoisyContainer'
import { AddNameAndTagsProps } from './types'

export const AddNameAndTags = React.memo((props: AddNameAndTagsProps) => {
  const { entityName, name, tags, handleNameChange, handleTagsChange } =
    useAddNameAndTags(props)

  return (
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
                  <div className="tp-body2 fs-md">{entityName} name</div>
                  <div className="tp-body1 fs-md">
                    Assign a descriptive and unique name to your function,
                    allowing you to quickly identify it among others in your
                    application, understand the function&apos;s purpose and
                    improve overall project organisation.
                  </div>
                </div>
              </div>
            }
          >
            {entityName} name
          </InfoTooltipButton>
        </div>
        <TextInput
          placeholder="Give it a name"
          error={name ? undefined : { message: 'This field is required' }}
          name="__config_function_name"
          onChange={handleNameChange}
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
                    Add relevant tags to categorize your functions based on
                    their functionality, purpose, or any other criteria that
                    provide personal context. Tags enable easy filtering and
                    searching within your project, simplifying management and
                    collaboration.
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
          value={tags}
          onChange={handleTagsChange}
        />
      </div>
    </NoisyContainer>
  )
})
AddNameAndTags.displayName = 'AddNameAndTags'

export default AddNameAndTags