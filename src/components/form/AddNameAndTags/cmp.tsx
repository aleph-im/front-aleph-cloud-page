import React from 'react'
import { TextInput, ChipInput } from '@aleph-front/core'
import { useAddNameAndTags } from '@/hooks/form/useAddNameAndTags'
import InfoTooltipButton from '@/components/common/InfoTooltipButton'
import { NoisyContainer } from '@aleph-front/core'
import { AddNameAndTagsProps } from './types'

export const AddNameAndTags = React.memo((props: AddNameAndTagsProps) => {
  const { entityName, nameCtrl, tagsCtrl } = useAddNameAndTags(props)

  return (
    <>
      <NoisyContainer $type="grain-3">
        <div>
          <TextInput
            {...nameCtrl.field}
            {...nameCtrl.fieldState}
            label={`${entityName} name`}
            placeholder="Give it a name"
            required
          />
        </div>
        <div tw="mt-4">
          <ChipInput
            {...tagsCtrl.field}
            {...tagsCtrl.fieldState}
            label="Tags"
            placeholder="Tags (press enter to add a new tag)"
          />
        </div>
      </NoisyContainer>
      <div tw="mt-6 text-right">
        <InfoTooltipButton
          my="bottom-right"
          at="top-right"
          tooltipContent={
            <div className="tp-body1 fs-18">
              <div tw="mb-8">
                <div className="tp-body2 fs-18">{entityName} name</div>
                Assign a descriptive and unique name to your {entityName},
                allowing you to quickly identify it among others in your
                application, understand the {entityName}&apos;s purpose and
                improve overall project organisation.
              </div>
              <div>
                <div className="tp-body2 fs-18">Tags</div>
                Add relevant tags to categorize your {entityName}s based on its
                functionality, purpose, or any other criteria that provide
                personal context. Tags enable easy filtering and searching
                within your project, simplifying management and collaboration.
              </div>
            </div>
          }
        >
          More info
        </InfoTooltipButton>
      </div>
    </>
  )
})
AddNameAndTags.displayName = 'AddNameAndTags'

export default AddNameAndTags
