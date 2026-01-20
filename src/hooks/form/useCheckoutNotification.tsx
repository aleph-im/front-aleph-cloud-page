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
  // @todo: Export types form core
  noti?: any
}

export function useCheckoutNotification({
  steps: stepsProp,
}: UseCheckoutNotificationProps = {}): UseCheckoutNotificationReturn {
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
    noti,
  }
}

export const stepsCatalog: Record<CheckoutStepType, CheckoutNotificationStep> =
  {
    reserve: {
      title: 'Sign CRN resources reservation',
      content:
        'By signing this, you are doing a reservation of hardware resources on the selected CRN until the instance is correctly allocated.',
    },
    stream: {
      title: 'Sign PAYG Activation',
      content:
        'By signing this, you authorise the initiation of a token stream for billing, ensuring a seamless and efficient payment process aligning costs directly with your usage.',
    },
    streamDel: {
      title: 'Sign PAYG Cancellation',
      content: 'By signing this, you confirm the cancellation of your stream.',
    },
    volume: {
      title: 'Sign Volume(s) Creation',
      content:
        'By signing this, you confirm the creation of new volume(s). This is required if you are creating/updating a website, or if you have set up additional storage volume(s) for your instance or function.',
    },
    volumeDel: {
      title: 'Sign Volume(s) Deletion',
      content: 'By signing this, you confirm the deletion of your volume(s).',
    },
    volumeUp: {
      title: 'Sign Volume(s) Update',
      content: 'By signing this, you confirm the update of your volume(s).',
    },
    ssh: {
      title: 'Sign SSH Key(s) Configuration',
      content:
        'By signing this, you confirm the SSH key(s) configuration, enabling encrypted communication with your instance. This is crucial for securing remote access.',
    },
    sshDel: {
      title: 'Sign SSH Key(s) Deletion',
      content: 'By signing this, you confirm the deletion of your SSH Key(s).',
    },
    sshUp: {
      title: 'Sign SSH Key(s) Update',
      content: 'By signing this, you confirm the update of your SSH Key(s).',
    },
    instance: {
      title: 'Sign Instance Creation',
      content:
        "By signing this, you confirm the creation of your new instance on Aleph Cloud. This step finalises the setup options you've chosen, including resources, configurations, and any additional features.",
    },
    instanceDel: {
      title: 'Sign Instance Deletion',
      content: 'By signing this, you confirm the deletion of your instance.',
    },
    instanceUp: {
      title: 'Sign Instance Update',
      content: 'By signing this, you confirm the update of your instance.',
    },
    program: {
      title: 'Sign Function Creation',
      content:
        "By signing this, you confirm the creation of your new function on Aleph Cloud. This step finalises the setup options you've chosen, including the codebase volume, resources, configurations, and any additional features.",
    },
    programDel: {
      title: 'Sign Function Deletion',
      content: 'By signing this, you confirm the deletion of your function.',
    },
    programUp: {
      title: 'Sign Function Update',
      content: 'By signing this, you confirm the update of your function.',
    },
    domain: {
      title: 'Sign Custom Domain(s) Creation',
      content:
        'By signing this, you confirm the custom domain(s) settings for your website, instance or function.',
    },
    domainDel: {
      title: 'Sign Custom Domain(s) Deletion',
      content:
        'By signing this, you confirm the deletion of your custom domain(s).',
    },
    domainUp: {
      title: 'Sign Custom Domain(s) Update',
      content:
        'By signing this, you confirm the update of your custom domain(s).',
    },
    website: {
      title: 'Sign Website Creation',
      content:
        'By signing this, you confirm the deployment of your new website on Aleph Cloud.',
    },
    websiteDel: {
      title: 'Sign Website Deletion',
      content: 'By signing this, you confirm the deletion of your website.',
    },
    websiteUp: {
      title: 'Sign Website Update',
      content: 'By signing this, you confirm the update of your website.',
    },
    allocate: {
      title: 'Allocate the instance',
      content:
        'Notifiying the selected CRN for allocating the instance. It can take a while',
    },
    portForwarding: {
      title: 'Sign Port Forwarding Configuration',
      content:
        'By signing this, you confirm the port forwarding configuration for your instance, enabling network access to specific ports.',
    },
    portForwardingDel: {
      title: 'Sign Port Forwarding Deletion',
      content:
        'By signing this, you confirm the deletion of your port forwarding configuration.',
    },
    creditTransaction: {
      title: 'Sign Credit Payment Transaction',
      content:
        'By signing this transaction, you confirm the payment for your credit top-up. This will transfer the specified amount from your wallet.',
    },
    permissions: {
      title: 'Sign Permissions Creation',
      content:
        'By signing this, you confirm the creation of new permissions for delegated access control.',
    },
    permissionsDel: {
      title: 'Sign Permissions Deletion',
      content: 'By signing this, you confirm the deletion of your permissions.',
    },
  }
