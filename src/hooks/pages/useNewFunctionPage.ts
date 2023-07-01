import { useAppState } from '@/contexts/appState'
import {
  getTotalProductCost,
  isValidItemHash,
  parseEnvVars,
} from '@/helpers/utils'
import JSZip from 'jszip'
import { FormEvent, useCallback, useMemo } from 'react'
import useConnectedWard from '../useConnectedWard'
import { createFunctionProgram } from '../../helpers/aleph'
import { useRouter } from 'next/router'
import {
  FunctionRuntimeId,
  FunctionRuntimes,
} from '../form/useSelectFunctionRuntime'
import {
  InstanceSpecs,
  defaultSpecsOptions,
} from '../form/useSelectInstanceSpecs'
import {
  Volume,
  defaultVolume,
  displayVolumesToAlephVolumes,
} from '../form/useAddVolume'
import { useForm } from '../useForm'
import { EnvVar } from '../form/useAddEnvVars'

export type NewFunctionFormState = {
  runtime: FunctionRuntimeId
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
  envVars: EnvVar[]
  metaTags: string[]
}

const samplePythonCode = `from fastapi import FastAPI

app = FastAPI()
@app.get("/")
async def root():
  return {"message": "Hello World"}
`

const initialState: NewFunctionFormState = {
  runtime: FunctionRuntimeId.Debian11,
  isPersistent: false,
  functionName: '',
  functionTags: [],
  specs: defaultSpecsOptions[0],
  volumes: [{ ...defaultVolume }],
  functionCode: samplePythonCode,
  codeLanguage: 'python',
  codeOrFile: 'code',
  envVars: [],
  metaTags: [],
}

// @todo: Split this into reusable hooks by composition

export type UseNewFunctionPage = {
  formState: NewFunctionFormState
  handleSubmit: (e: FormEvent) => Promise<void>
  setFormValue: (name: keyof NewFunctionFormState, value: any) => void
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  handleChangeEntityTab: (tabId: string) => void
  handleChangeInstanceSpecs: (specs: InstanceSpecs) => void
  handleChangeVolumes: (volumes: Volume[]) => void
  handleChangeEnvVars: (envVars: EnvVar[]) => void
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
        formState.runtime !== FunctionRuntimeId.Custom
          ? FunctionRuntimes[formState.runtime].id
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

      const { functionName, metaTags, isPersistent, specs, envVars } = formState

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
        variables: parseEnvVars(envVars) || {},
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

  const handleChangeEnvVars = useCallback(
    (envVars: EnvVar[]) => setFormValue('envVars', envVars),
    [setFormValue],
  )

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
    address: account?.address || '',
    accountBalance: accountBalance || 0,
    isCreateButtonDisabled,
    handleChangeEntityTab,
    handleChangeInstanceSpecs,
    handleChangeVolumes,
    handleChangeEnvVars,
  }
}
