import CheckoutNotification, {
  CheckoutNotificationProps,
} from '@/components/form/CheckoutNotification'
import { CheckoutNotificationStep } from '@/components/form/CheckoutNotification/types'
import { CheckoutStepType } from '@/helpers/constants'
import { sleep } from '@/helpers/utils'
import { useNotification } from '@aleph-front/core'
import { useCallback, useRef } from 'react'
import Err from '@/helpers/errors'

export type { CheckoutStepType }

export type UseCheckoutNotificationSteps = CheckoutNotificationProps['steps']

export type UseCheckoutNotificationProps = {
  steps?: UseCheckoutNotificationSteps
}

export type UseCheckoutNotificationReturn = {
  next: (newSteps?: UseCheckoutNotificationSteps) => Promise<void>
  stop: () => Promise<void>
}

export function useCheckoutNotification({
  steps: stepsProp,
}: UseCheckoutNotificationProps): UseCheckoutNotificationReturn {
  const noti = useNotification()
  const step = useRef(0)

  const stepsNotiId = 'CHECKOUT-NOTI'

  const handleNext = useCallback(
    async (newSteps?: UseCheckoutNotificationSteps) => {
      if (!noti) throw Err.NotificationsNotReady
      const steps = newSteps || stepsProp || []
      noti.del(stepsNotiId)

      await sleep(200)

      noti.set(stepsNotiId, {
        id: stepsNotiId,
        timeout: 0,
        variant: 'warning',
        content: (
          <CheckoutNotification
            {...{
              activeStep: step.current,
              steps,
            }}
          />
        ),
      })

      step.current += 1
    },
    [noti, stepsProp],
  )

  const handleStop = useCallback(async () => {
    if (!noti) throw Err.NotificationsNotReady

    step.current = 0
    noti.del(stepsNotiId)

    await sleep(2000)
  }, [noti])

  return {
    next: handleNext,
    stop: handleStop,
  }
}

export const stepsCatalog: Record<CheckoutStepType, CheckoutNotificationStep> =
  {
    stream: {
      title: 'Sign PAYG',
      content:
        'By signing this, you authorise the initiation of a token stream for billing, ensuring a seamless and efficient payment process aligning costs directly with your usage.',
    },
    volume: {
      title: 'Sign Volume',
      content:
        'By signing this, you confirm the creation of a new volume. This is required if you are deploying a new website or if you have set up additional storage volume(s) for your instance or function.',
    },
    ssh: {
      title: 'Sign SSH',
      content:
        'By signing this, you confirm the SSH keys configuration, enabling encrypted communication with your instance. This is crucial for securing remote access.',
    },
    instance: {
      title: 'Sign Instance Creation',
      content:
        "By signing this, you confirm the creation of your new instance on Twentysix.cloud. This step finalises the setup options you've chosen, including resources, configurations, and any additional features.",
    },
    program: {
      title: 'Sign Function Creation',
      content:
        "By signing this, you confirm the creation of your new function on Twentysix.cloud. This step finalises the setup options you've chosen, including the codebase volume, resources, configurations, and any additional features.",
    },
    domain: {
      title: 'Sign Custom Domain',
      content:
        'By signing this, you confirm the custom domain settings for your website, instance or function.',
    },
    website: {
      title: 'Sign Website Creation',
      content:
        'By signing this, you confirm the deployment of your new website on Twentysix.cloud.',
    },
  }
