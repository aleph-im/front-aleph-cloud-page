import React, { memo } from 'react'
import { TextGradient, TextInput } from '@aleph-front/core'
import Price from '@/components/common/Price'
import { ellipseText } from '@/helpers/utils'
import { StyledArrowIcon } from './styles'
import { StreamSummaryProps } from './types'

export const StreamSummary = ({
  title,
  sender,
  flow,
  receiver,
}: StreamSummaryProps) => {
  return (
    <>
      <div className="bg-purple0" tw="p-6">
        {title && (
          <TextGradient forwardedAs="h3" type="h7" tw="mb-6">
            {title}
          </TextGradient>
        )}
        <div tw="w-full flex flex-col md:flex-row items-stretch md:items-end gap-0 md:gap-6">
          <div tw="flex-1">
            <TextInput
              tabIndex={-1}
              name="sender"
              label="Sender"
              value={ellipseText(sender, 12, 10)}
              dataView
            />
          </div>
          <div tw="self-center md:self-end rotate-90 md:rotate-0 pl-9 md:pl-0">
            <StyledArrowIcon />
          </div>
          <div tw="flex-1">
            <TextInput
              tabIndex={-1}
              name="receiver"
              label="Receiver"
              value={ellipseText(receiver, 12, 10)}
              dataView
            />
          </div>
        </div>
        <div className="text-main0 tp-body2 fs-12" tw="text-center mt-6">
          Streaming: <Price value={flow} /> per hour
        </div>
      </div>
    </>
  )
}

export default memo(StreamSummary) as typeof StreamSummary
