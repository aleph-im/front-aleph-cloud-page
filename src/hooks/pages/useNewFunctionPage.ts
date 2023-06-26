import { useAppState } from '@/contexts/appState'
import {
  EnvironmentVariable,
  getTotalProductCost,
  isValidItemHash,
  safeCollectionToObject,
} from '@/helpers/utils'
import {
  defaultVolume,
  displayVolumesToAlephVolumes,
  Volume,
  VolumeTypes,
} from '@/helpers/form'
import JSZip from 'jszip'
import { FormEvent, useCallback, useMemo, useReducer } from 'react'
import useConnectedWard from '../useConnectedWard'
import { createFunctionProgram } from '../../helpers/aleph'
import { useRequestState } from '../useRequestState'
import { useRouter } from 'next/router'
import { RuntimeId, Runtimes } from '../form/useRuntimeSelector'
import { InstanceSpecs } from '../form/useInstanceSpecsSelector'

export type FormState = {
  runtime: RuntimeId
  customRuntimeHash?: string
  isPersistent: boolean
  functionName: string
  functionTags: string[]
  volumes: Volume[]
  codeOrFile: 'code' | 'file'
  codeLanguage: string
  functionCode?: string
  functionFile?: File
  cpu: number
  ram: number
  environmentVariables: EnvironmentVariable[]
  metaTags: string[]
}

const samplePythonCode = `from fastapi import FastAPI

app = FastAPI()
@app.get("/")
async def root():
  return {"message": "Hello World"}
`

export const initialFormState: FormState = {
  runtime: RuntimeId.Debian11,
  isPersistent: false,
  functionName: '',
  functionTags: [],
  volumes: [defaultVolume],
  functionCode: samplePythonCode,
  codeLanguage: 'python',
  codeOrFile: 'code',
  cpu: 1,
  ram: 2,
  environmentVariables: [],
  metaTags: [],
}

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
  handleChangeEntityTab: (tabId: string) => void
  handleChangeInstanceSpecs: (specs: InstanceSpecs) => void
}

export function useNewFunctionPage(): NewFunctionPage {
  useConnectedWard()

  const router = useRouter()
  const [appState] = useAppState()
  const { account, accountBalance } = appState

  const [formState, dispatchForm] = useReducer(
    (state: FormState, action: { type: string; payload: any }): FormState => {
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

  const [, { onLoad, onSuccess, onError }] = useRequestState()

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

    const runtime =
      formState.runtime !== RuntimeId.Custom
        ? Runtimes[formState.runtime].id
        : formState.customRuntimeHash || ''

    if (!runtime || !isValidItemHash(runtime)) return alert('Invalid runtime')

    if (!isValidItemHash(runtime || '')) return alert('Invalid runtime hash')

    try {
      if (!account) throw new Error('Account not found')
      const alephVolumes = await displayVolumesToAlephVolumes(
        account,
        formState.volumes,
      )

      onLoad()

      const {
        functionName,
        metaTags,
        isPersistent,
        cpu,
        ram,
        environmentVariables,
      } = formState

      await createFunctionProgram({
        account,
        name: functionName.trim() || 'Untitled function',
        tags: metaTags,
        isPersistent: isPersistent,
        file,
        runtime,
        volumes: alephVolumes, // TODO: Volumes
        entrypoint: 'main:app', // TODO: Entrypoint
        memory: ram,
        vcpus: cpu,
        variables: safeCollectionToObject(environmentVariables),
      })

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }

  const setFormValue = useCallback(
    (name: keyof FormState, value: any) =>
      dispatchForm({ type: 'SET_VALUE', payload: { name, value } }),
    [],
  )

  const handleChangeInstanceSpecs = useCallback(
    (specs: InstanceSpecs) => {
      setFormValue('cpu', specs.cpu)
      setFormValue('ram', specs.ram)
    },
    [setFormValue],
  )

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
        cpu: formState.cpu,
        isPersistentStorage: formState.isPersistent,
        capabilities: {},
      }),
    [formState],
  )

  const canAfford = (accountBalance || 0) > totalCost
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  const handleChangeEntityTab = useCallback(
    (id: string) => {
      router.push(`/dashboard/${id}`)
    },
    [router],
  )

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
    handleChangeEntityTab,
    handleChangeInstanceSpecs,
  }
}
