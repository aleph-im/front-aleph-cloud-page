import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import {
  FunctionRuntimeProp,
  defaultFunctionRuntimeOptions,
} from '../../form/useSelectFunctionRuntime'
import {
  InstanceSpecsProp,
  getDefaultSpecsOptions,
} from '../../form/useSelectInstanceSpecs'
import { VolumeProp } from '../../form/useAddVolume'
import { EnvVarProp } from '../../form/useAddEnvVars'
import { NameAndTagsProp } from '../../form/useAddNameAndTags'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { useProgramManager } from '@/hooks/common/useManager/useProgramManager'
import { ActionTypes } from '@/helpers/store'
import { DomainProp } from '@/hooks/form/useAddDomains'
import { ProgramManager } from '@/domain/program'
import { UseControllerReturn, useController } from 'react-hook-form'
import { FunctionCodeProp, defaultCode } from '@/hooks/form/useAddFunctionCode'

export type NewFunctionFormState = {
  code?: FunctionCodeProp
  nameAndTags?: NameAndTagsProp
  runtime: FunctionRuntimeProp
  isPersistent: boolean
  volumes?: VolumeProp[]
  specs?: InstanceSpecsProp
  envVars?: EnvVarProp[]
  domains?: DomainProp[]
}

const defaultValues: Partial<NewFunctionFormState> = {
  code: { ...defaultCode },
  runtime: defaultFunctionRuntimeOptions[0],
  specs: getDefaultSpecsOptions(false)[0],
  isPersistent: false,
  // volumes: [{ ...defaultVolume }],
}

// @todo: Split this into reusable hooks by composition

export type UseNewFunctionPage = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  functionCodeCtrl: UseControllerReturn<NewFunctionFormState, 'code'>
  runtimeCtrl: UseControllerReturn<NewFunctionFormState, 'runtime'>
  specsCtrl: UseControllerReturn<NewFunctionFormState, 'specs'>
  volumesCtrl: UseControllerReturn<NewFunctionFormState, 'volumes'>
  envVarsCtrl: UseControllerReturn<NewFunctionFormState, 'envVars'>
  domainsCtrl: UseControllerReturn<NewFunctionFormState, 'domains'>
  nameAndTagsCtrl: UseControllerReturn<NewFunctionFormState, 'nameAndTags'>
  isPersistentCtrl: UseControllerReturn<NewFunctionFormState, 'isPersistent'>
  handleSubmit: (e: FormEvent) => Promise<void>
  handleChangeEntityTab: (tabId: string) => void
  values: any
}

export function useNewFunctionPage(): UseNewFunctionPage {
  useConnectedWard()

  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account, accountBalance } = appState

  const manager = useProgramManager()

  const onSubmit = useCallback(
    async (state: NewFunctionFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const {
        runtime,
        nameAndTags,
        isPersistent,
        envVars,
        domains,
        volumes,
        specs,
        code: { code } = {},
      } = state

      const accountFunction = await manager.add({
        ...nameAndTags,
        runtime,
        envVars,
        domains,
        specs,
        volumes,
        isPersistent,
        // @todo: Move this to a new FunctionCode component that will always return
        // a file and an entrypoint depending on the selected language and code
        file: code,
      })

      dispatch({
        type: ActionTypes.addAccountFunction,
        payload: { accountFunction },
      })

      // @todo: Check new volumes and domains being created to add them to the store

      router.replace('/dashboard')
    },
    [dispatch, manager, router],
  )

  const { watch, control, handleSubmit } = useForm({ defaultValues, onSubmit })

  const values = watch()

  const functionCodeCtrl = useController({
    control,
    name: 'code',
    rules: { required: true },
  })

  const runtimeCtrl = useController({
    control,
    name: 'runtime',
    rules: { required: true },
  })

  const specsCtrl = useController({
    control,
    name: 'specs',
    rules: { required: true },
  })

  const volumesCtrl = useController({
    control,
    name: 'volumes',
    rules: { required: false },
  })

  const envVarsCtrl = useController({
    control,
    name: 'envVars',
    rules: { required: false },
  })

  const domainsCtrl = useController({
    control,
    name: 'domains',
    rules: { required: false },
  })

  const nameAndTagsCtrl = useController({
    control,
    name: 'nameAndTags',
    rules: { required: true },
  })

  const isPersistentCtrl = useController({
    control,
    name: 'isPersistent',
    rules: {
      validate: {
        required: (value) => typeof value === 'boolean',
      },
    },
  })

  const { totalCost } = useMemo(
    () =>
      ProgramManager.getCost({
        specs: specsCtrl.field.value,
        isPersistent: isPersistentCtrl.field.value,
        volumes: volumesCtrl.field.value,
        capabilities: {},
      }),
    [
      isPersistentCtrl.field.value,
      specsCtrl.field.value,
      volumesCtrl.field.value,
    ],
  )

  const canAfford = (accountBalance || 0) > totalCost
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  const handleChangeEntityTab = useCallback(
    (id: string) => router.push(`/dashboard/${id}`),
    [router],
  )

  return {
    address: account?.address || '',
    accountBalance: accountBalance || 0,
    isCreateButtonDisabled,
    functionCodeCtrl,
    runtimeCtrl,
    specsCtrl,
    volumesCtrl,
    envVarsCtrl,
    domainsCtrl,
    nameAndTagsCtrl,
    isPersistentCtrl,
    handleSubmit,
    handleChangeEntityTab,
    values,
  }
}
