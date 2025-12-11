import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useForm } from '@/hooks/common/useForm'
import { NameAndTagsField } from '@/hooks/form/useAddNameAndTags'
import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import {
  InstanceSystemVolumeField,
  VolumeField,
} from '@/hooks/form/useAddVolume'
import { InstanceImageField } from '@/hooks/form/useSelectInstanceImage'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { DomainField } from '@/hooks/form/useAddDomains'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PaymentMethod } from '@/helpers/constants'
import { CRNSpecs } from '@/domain/node'
import { StreamDurationField } from '@/hooks/form/useSelectStreamDuration'
import { useCheckoutNotification } from '@/hooks/form/useCheckoutNotification'
import { useConnection } from '@/hooks/common/useConnection'
import Err from '@/helpers/errors'
import { TooltipProps } from '@aleph-front/core'
import { accountConnectionRequiredDisabledMessage } from './disabledMessages'
import { usePermissionsManager } from '@/hooks/common/useManager/usePermissionManager'
import { PermissionsManager } from '@/domain/permissions'

export type NewPermissionFormState = NameAndTagsField & {
  image: InstanceImageField
  specs: InstanceSpecsField
  sshKeys: SSHKeyField[]
  volumes?: VolumeField[]
  domains?: DomainField[]
  systemVolume: InstanceSystemVolumeField
  nodeSpecs?: CRNSpecs
  paymentMethod: PaymentMethod
  streamDuration: StreamDurationField
  streamCost: number
  termsAndConditions?: string
}

export type Modal = 'node-list' | 'terms-and-conditions'

export type UseNewPermissionPageReturn = {
  createPermissionDisabled: boolean
  createPermissionDisabledMessage?: TooltipProps['content']
  createPermissionButtonTitle?: string
  values: any
  control: Control<any>
  errors: FieldErrors<NewPermissionFormState>
  handleSubmit: (e: FormEvent) => Promise<void>
  handleBack: () => void
}

export function useNewPermissionPage(): UseNewPermissionPageReturn {
  const { account } = useConnection({
    triggerOnMount: false,
  })

  const router = useRouter()

  // -------------------------
  // Checkout flow

  const manager = usePermissionsManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewPermissionFormState) => {
      if (!manager) throw Err.ConnectYourWallet
      if (!account) throw Err.InvalidAccount

      console.log('Saving all changes:', state)
      // @todo: implement actual save logic here
    },
    [manager, account],
  )

  // -------------------------
  // Setup form

  const defaultValues: Partial<NewPermissionFormState> = useMemo(() => ({}), [])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(PermissionsManager.addSchema),
    readyDeps: [],
  })

  const formValues = useWatch({ control }) as NewPermissionFormState

  // -------------------------
  // Memos
  const createPermissionDisabledMessage: UseNewPermissionPageReturn['createPermissionDisabledMessage'] =
    useMemo(() => {
      if (!account)
        return accountConnectionRequiredDisabledMessage(
          'create a new permission',
        )
    }, [account])

  const createPermissionButtonTitle: UseNewPermissionPageReturn['createPermissionButtonTitle'] =
    useMemo(() => {
      if (!account) return 'Connect'

      return 'Save permissions'
    }, [account])

  const createPermissionDisabled = useMemo(() => {
    if (createPermissionButtonTitle !== 'Save permissions') return true

    return !!createPermissionDisabledMessage
  }, [createPermissionButtonTitle, createPermissionDisabledMessage])

  // -------------------------
  // Handlers

  const handleBack = () => {
    router.push('.')
  }

  return {
    createPermissionDisabled,
    createPermissionDisabledMessage,
    createPermissionButtonTitle,
    values: formValues,
    control,
    errors,
    handleSubmit,
    handleBack,
  }
}
