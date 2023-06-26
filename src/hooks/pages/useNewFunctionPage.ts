import { useAppState } from '@/contexts/appState'
import {
  EnvironmentVariable,
  getTotalProductCost,
  isValidItemHash,
  safeCollectionToObject,
} from '@/helpers/utils'
import JSZip from 'jszip'
import { FormEvent, useCallback, useMemo } from 'react'
import useConnectedWard from '../useConnectedWard'
import { createFunctionProgram } from '../../helpers/aleph'
import { useRouter } from 'next/router'
import { RuntimeId, Runtimes } from '../form/useRuntimeSelector'
import {
  InstanceSpecs,
  defaultSpecsOptions,
} from '../form/useInstanceSpecsSelector'
import {
  Volume,
  defaultVolume,
  displayVolumesToAlephVolumes,
} from '../form/useAddVolume'
import { useForm } from '../useForm'

export type NewFunctionFormState = {
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
  specs?: InstanceSpecs
  environmentVariables: EnvironmentVariable[]
  metaTags: string[]
}

const samplePythonCode = `from fastapi import FastAPI

app = FastAPI()
@app.get("/")
async def root():
  return {"message": "Hello World"}
`

const initialState: NewFunctionFormState = {
  runtime: RuntimeId.Debian11,
  isPersistent: false,
  functionName: '',
  functionTags: [],
  specs: defaultSpecsOptions[0],
  volumes: [{ ...defaultVolume }],
  functionCode: samplePythonCode,
  codeLanguage: 'python',
  codeOrFile: 'code',
  environmentVariables: [],
  metaTags: [],
}

// @todo: Split this into reusable hooks by composition

export type UseNewFunctionPage = {
  formState: NewFunctionFormState
  handleSubmit: (e: FormEvent) => Promise<void>
  setFormValue: (name: keyof NewFunctionFormState, value: any) => void
  setEnvironmentVariable: (
    variableIndex: number,
    variableKey: 'name' | 'value',
    variableValue: string,
  ) => void
  addEnvironmentVariable: () => void
  removeEnvironmentVariable: (variableIndex: number) => void
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  handleChangeEntityTab: (tabId: string) => void
  handleChangeInstanceSpecs: (specs: InstanceSpecs) => void
  handleChangeVolumes: (volumes: Volume[]) => void
}

export function useNewFunctionPage(): UseNewFunctionPage {
  useConnectedWard()

  const router = useRouter()
  const [appState] = useAppState()
  const { account, accountBalance } = appState

  const onSubmit = useCallback(
    async (formState: NewFunctionFormState) => {
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
        throw new Error('Invalid code or file')
      }

      const runtime =
        formState.runtime !== RuntimeId.Custom
          ? Runtimes[formState.runtime].id
          : formState.customRuntimeHash || ''

      if (!runtime || !isValidItemHash(runtime))
        throw new Error('Invalid runtime')

      if (!isValidItemHash(runtime || ''))
        throw new Error('Invalid runtime hash')

      if (!account) throw new Error('Account not found')

      const alephVolumes = await displayVolumesToAlephVolumes(
        account,
        formState.volumes,
      )

      const {
        functionName,
        metaTags,
        isPersistent,
        specs,
        environmentVariables,
      } = formState

      if (!specs) throw new Error('Invalid instance specs')

      await createFunctionProgram({
        account,
        name: functionName.trim() || 'Untitled function',
        tags: metaTags,
        isPersistent: isPersistent,
        file,
        runtime,
        volumes: alephVolumes, // TODO: Volumes
        entrypoint: 'main:app', // TODO: Entrypoint
        memory: specs.ram,
        vcpus: specs.cpu,
        variables: safeCollectionToObject(environmentVariables),
      })

      router.replace('/dashboard')
    },
    [account, router],
  )

  const {
    state: formState,
    setFormValue,
    handleSubmit,
  } = useForm({ initialState, onSubmit })

  const handleChangeInstanceSpecs = useCallback(
    (specs: InstanceSpecs) => setFormValue('specs', specs),
    [setFormValue],
  )

  const handleChangeVolumes = useCallback(
    (volumes: Volume[]) => setFormValue('volumes', volumes),
    [setFormValue],
  )

  const addEnvironmentVariable = () => {
    setFormValue('environmentVariables', [
      ...formState.environmentVariables,
      { name: '', value: '' },
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

  const { totalCost } = useMemo(
    () =>
      getTotalProductCost({
        volumes: formState.volumes,
        cpu: formState.specs?.cpu || 0,
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
    (id: string) => router.push(`/dashboard/${id}`),
    [router],
  )

  return {
    formState,
    handleSubmit,
    setFormValue,
    setEnvironmentVariable,
    addEnvironmentVariable,
    removeEnvironmentVariable,
    address: account?.address || '',
    accountBalance: accountBalance || 0,
    isCreateButtonDisabled,
    handleChangeEntityTab,
    handleChangeInstanceSpecs,
    handleChangeVolumes,
  }
}
