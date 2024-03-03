import React, { memo } from 'react'
import tw from 'twin.macro'
import { Icon } from '@aleph-front/core'
import {
  CheckoutNotificationProps,
  CheckoutNotificationStepProps,
} from './types'

export const CheckoutNotificationStep = ({
  isActive,
  step,
  total,
  title,
  content,
}: CheckoutNotificationStepProps) => {
  return (
    <div css={[!isActive && tw`opacity-30`]}>
      <div className="tp-h7" tw="flex items-center justify-between mb-2">
        <div tw="flex items-center gap-4">
          {title}
          {isActive && (
            <Icon name="arrows-rotate" size="0.8em" tw="animate-spin" />
          )}
        </div>
        <div className="tp-body2 fs-18">
          {step + 1}/{total}
        </div>
      </div>
      <div className="tp-body1">{content}</div>
    </div>
  )
}

// ------------------------------------------

export const CheckoutNotification = ({
  steps,
  activeStep,
}: CheckoutNotificationProps) => {
  return (
    <div tw="flex flex-col gap-8">
      {steps.map((step, index) => (
        <CheckoutNotificationStepMemo
          key={index}
          {...{
            step: index,
            total: steps.length,
            isActive: index === activeStep,
            ...step,
          }}
        />
      ))}
    </div>
  )
}

export const CheckoutNotificationStepMemo = memo(
  CheckoutNotificationStep,
) as typeof CheckoutNotificationStep

export default memo(CheckoutNotification) as typeof CheckoutNotification
