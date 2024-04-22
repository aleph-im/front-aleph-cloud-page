import CheckoutNotification, {
  CheckoutNotificationProps,
} from '@/components/form/CheckoutNotification'
import { CheckoutNotificationStep } from '@/components/form/CheckoutNotification/types'
import { CheckoutStepType } from '@/helpers/constants'
import { sleep } from '@/helpers/utils'
import { useNotification } from '@aleph-front/core'
import { useCallback, useRef } from 'react'

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
      if (!noti) throw new Error('Notifications not ready')
      const steps = newSteps || stepsProp || []

      console.log('steps', steps)

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
    if (!noti) throw new Error('Notifications not ready')

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
        "This step involves signing the volume configuration and is required if you've set up additional storage volume for your instance or function.",
    },
    ssh: {
      title: 'Sign SSH',
      content:
        'This step is crucial for securing remote access to your instance. By signing this, you confirm the SSH keys configuration, enabling encrypted communication with your server.',
    },
    instance: {
      title: 'Sign instance creation',
      content:
        "By signing this, you confirm the creation of your new instance on Twentysix.cloud. This step finalises the setup options you've chosen, including resources, configurations, and any additional features.",
    },
    program: {
      title: 'Sign function creation',
      content:
        "By signing this, you confirm the creation of your new function (and the volume containing the code if it were necessary) on Twentysix.cloud. This step finalises the setup options you've chosen, including resources, configurations, and any additional features.",
    },
    domain: {
      title: 'Sign custom domain',
      content:
        'This final step confirms your custom domain settings and integrates it with your instance.',
    },
  }
