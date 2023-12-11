import React from 'react'
import { TextInput, ChipInput, FormLabel } from '@aleph-front/aleph-core'
import { useAddNameAndTags } from '@/hooks/form/useAddNameAndTags'
import InfoTooltipButton from '@/components/common/InfoTooltipButton'
import NoisyContainer from '@/components/common/NoisyContainer'
import { AddNameAndTagsProps } from './types'

export const AddNameAndTags = React.memo((props: AddNameAndTagsProps) => {
  const { entityName, nameCtrl, tagsCtrl } = useAddNameAndTags(props)

  return (
    <NoisyContainer>
      <div>
        <div tw="mb-2">
          <InfoTooltipButton
            plain
            my="bottom-left"
            at="bottom-right"
            vAlign="top"
            tooltipContent={
              <div tw="text-left">
                <div>
                  <div className="tp-body2 fs-18">{entityName} name</div>
                  <div className="tp-body1 fs-18">
                    Assign a descriptive and unique name to your function,
                    allowing you to quickly identify it among others in your
                    application, understand the function&apos;s purpose and
                    improve overall project organisation.
                  </div>
                </div>
              </div>
            }
          >
            <FormLabel
              label={`${entityName} name`}
              required
              error={nameCtrl.fieldState.error}
            />
          </InfoTooltipButton>
        </div>
        <TextInput
          {...nameCtrl.field}
          {...nameCtrl.fieldState}
          required
          placeholder="Give it a name"
        />
      </div>
      <div tw="mt-4">
        <div tw="mb-2">
          <InfoTooltipButton
            plain
            my="bottom-left"
            at="bottom-right"
            vAlign="top"
            tooltipContent={
              <div tw="text-left">
                <div>
                  <div className="tp-body2 fs-18">Tags</div>
                  <div className="tp-body1 fs-18">
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
            <FormLabel label="Tags" error={tagsCtrl.fieldState.error} />
          </InfoTooltipButton>
        </div>
        <ChipInput
          {...tagsCtrl.field}
          {...tagsCtrl.fieldState}
          placeholder="Tags (press enter to add a new tag)"
        />
      </div>
    </NoisyContainer>
  )
})
AddNameAndTags.displayName = 'AddNameAndTags'

export default AddNameAndTags
