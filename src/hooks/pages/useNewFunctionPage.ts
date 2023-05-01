import { useAppState } from '@/contexts/appState'
import {
  getTotalProductCost,
  isValidItemHash,
  safeCollectionToObject,
} from '@/helpers/utils'
import {
  defaultVolume,
  displayVolumesToAlephVolumes,
  FormState,
  initialFormState,
  runtimeRefs,
  Volume,
  VolumeTypes,
} from '@/helpers/form'
import JSZip from 'jszip'
import { FormEvent, useMemo, useReducer } from 'react'
import useConnectedWard from '../useConnectedWard'
import { createFunctionProgram } from '../../helpers/aleph'
import { useRequestState } from '../useRequestState'
import { useRouter } from 'next/router'

// @todo: Split this into reusable hooks by composition

export type NewFunctionPage = {
  formState: FormState
  handleSubmit: (e: FormEvent) => Promise<void>
  setFormValue: (name: keyof FormState, value: any) => void
  setEnvironmentVariable: (
    variableIndex: number,
    variableKey: 'name' | 'value',
    variableValue: string,
  ) => void
  addEnvironmentVariable: () => void
  removeEnvironmentVariable: (variableIndex: number) => void
  setVolumeType: (volumeIndex: number, volumeType: VolumeTypes) => void
  setVolumeValue: (
    volumeIndex: number,
    volumekey: keyof Volume,
    volumeValue: any,
  ) => void
  addVolume: () => void
  removeVolume: (volumeIndex: number) => void
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
}

export function useNewFunctionPage(): NewFunctionPage {
  useConnectedWard()

  const router = useRouter()
  const [appState] = useAppState()
  const { account, accountBalance } = appState

  const [formState, dispatchForm] = useReducer(
    (state: FormState, action: { type: string; payload: any }): FormState => {
      console.log('action', action)

      switch (action.type) {
        case 'SET_VALUE':
          return {
            ...state,
            [action.payload.name]: action.payload.value,
          }

        default:
          return state
      }
    },
    initialFormState,
  )

  const [reqState, { onLoad, onSuccess, onError }] = useRequestState()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    let file
    if (formState.codeOrFile === 'code') {
      const jsZip = new JSZip()
      jsZip.file('main.py', formState.functionCode || '')
      const zip = await jsZip.generateAsync({ type: 'blob' })
      file = new File([zip], 'main.py.zip', { type: 'application/zip' })
    } else if (
      formState.codeOrFile === 'file' &&
      formState.functionFile !== undefined
    ) {
      file = formState.functionFile
    } else {
      return alert('Invalid code or file')
    }

    let runtime = formState.customRuntimeHash || ''
    if (formState.runtime !== 'custom') {
      runtime = runtimeRefs[formState.runtime]
    }

    if (!runtime || !isValidItemHash(runtime)) return alert('Invalid runtime')

    if (!isValidItemHash(runtime || '')) return alert('Invalid runtime hash')

    try {
      if (!account) throw new Error('Account not found')
      const alephVolumes = await displayVolumesToAlephVolumes(
        account,
        formState.volumes,
      )

      onLoad()

      const msg = await createFunctionProgram({
        account,
        name: formState.functionName.trim() || 'Untitled function',
        tags: formState.metaTags,
        isPersistent: formState.isPersistent,
        file,
        runtime,
        volumes: alephVolumes, // TODO: Volumes
        entrypoint: 'main:app', // TODO: Entrypoint
        computeUnits: formState.computeUnits,
        variables: safeCollectionToObject(formState.environmentVariables),
      })

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }

  const setFormValue = (name: keyof FormState, value: any) =>
    dispatchForm({ type: 'SET_VALUE', payload: { name, value } })

  const addEnvironmentVariable = () => {
    setFormValue('environmentVariables', [
      ...formState.environmentVariables,
      {
        name: '',
        value: '',
      },
    ])
  }

  const setEnvironmentVariable = (
    variableIndex: number,
    variableKey: 'name' | 'value',
    variableValue: string,
  ) => {
    const variables = [...formState.environmentVariables]
    variables[variableIndex] = {
      ...variables[variableIndex],
      [variableKey]: variableValue,
    }
    setFormValue('environmentVariables', variables)
  }

  const removeEnvironmentVariable = (variableIndex: number) => {
    setFormValue(
      'environmentVariables',
      formState.environmentVariables.filter((_, i) => i !== variableIndex),
    )
  }

  const addVolume = () => {
    setFormValue('volumes', [
      ...formState.volumes,
      {
        ...defaultVolume,
      },
    ])
  }

  const removeVolume = (volumeIndex: number) => {
    setFormValue(
      'volumes',
      formState.volumes.filter((_, i) => i !== volumeIndex),
    )
  }

  const setVolumeType = (volumeIndex: number, volumeType: VolumeTypes) => {
    const volumes = [...formState.volumes]

    volumes[volumeIndex] = {
      ...volumes[volumeIndex],
      type: volumeType,
    }
    setFormValue('volumes', volumes)
  }

  const setVolumeValue = (
    volumeIndex: number,
    volumekey: keyof Volume,
    volumeValue: any,
  ) => {
    const volumes = [...formState.volumes]
    volumes[volumeIndex] = {
      ...volumes[volumeIndex],
      [volumekey]: volumeValue,
    }

    setFormValue('volumes', volumes)
  }

  const { totalCost } = useMemo(
    () =>
      getTotalProductCost({
        volumes: formState.volumes,
        computeUnits: formState.computeUnits,
        isPersistent: formState.isPersistent,
        capabilities: {},
      }),
    [formState],
  )

  const canAfford = (accountBalance || 0) > totalCost
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  return {
    formState,
    handleSubmit,
    setFormValue,
    setEnvironmentVariable,
    addEnvironmentVariable,
    removeEnvironmentVariable,
    setVolumeType,
    setVolumeValue,
    addVolume,
    removeVolume,
    address: account?.address || '',
    accountBalance: accountBalance || 0,
    isCreateButtonDisabled,
  }
}
