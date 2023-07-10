import { useAppState } from '@/contexts/appState'
import { getTotalProductCost } from '@/helpers/utils'
import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import {
  FunctionRuntimeProp,
  defaultFunctionRuntimeOptions,
} from '../../form/useSelectFunctionRuntime'
import {
  InstanceSpecsProp,
  defaultSpecsOptions,
} from '../../form/useSelectInstanceSpecs'
import { VolumeProp, defaultVolume } from '../../form/useAddVolume'
import { EnvVarProp } from '../../form/useAddEnvVars'
import { NameAndTagsProp } from '../../form/useAddNameAndTags'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { useProgramManager } from '@/hooks/common/useProgramManager'

export type NewFunctionFormState = {
  runtime: FunctionRuntimeProp
  isPersistent: boolean
  volumes: VolumeProp[]
  codeOrFile: 'code' | 'file'
  codeLanguage: string
  functionCode?: string
  functionFile?: File
  specs?: InstanceSpecsProp
  envVars?: EnvVarProp[]
  tags?: string[]
  name: string
}

const samplePythonCode = `from fastapi import FastAPI

app = FastAPI()
@app.get("/")
async def root():
  return {"message": "Hello World"}
`

const initialState: NewFunctionFormState = {
  runtime: defaultFunctionRuntimeOptions[0],
  isPersistent: false,
  name: '',
  specs: defaultSpecsOptions[0],
  volumes: [{ ...defaultVolume }],
  functionCode: samplePythonCode,
  codeLanguage: 'python',
  codeOrFile: 'code',
}

// @todo: Split this into reusable hooks by composition

export type UseNewFunctionPage = {
  formState: NewFunctionFormState
  handleSubmit: (e: FormEvent) => Promise<void>
  setFormValue: (name: keyof NewFunctionFormState, value: unknown) => void
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  handleChangeFunctionRuntime: (runtime: FunctionRuntimeProp) => void
  handleChangeEntityTab: (tabId: string) => void
  handleChangeInstanceSpecs: (specs: InstanceSpecsProp) => void
  handleChangeVolumes: (volumes: VolumeProp[]) => void
  handleChangeEnvVars: (envVars: EnvVarProp[]) => void
  handleChangeNameAndTags: (nameAndTags: NameAndTagsProp) => void
}

export function useNewFunctionPage(): UseNewFunctionPage {
  useConnectedWard()

  const router = useRouter()
  const [appState] = useAppState()
  const { account, accountBalance } = appState

  const manager = useProgramManager()

  const onSubmit = useCallback(
    async (state: NewFunctionFormState) => {
      console.log('state', state)

      if (!manager) throw new Error('Manager not ready')

      const {
        runtime,
        name,
        tags,
        isPersistent,
        envVars,
        volumes,
        specs,
        codeOrFile,
        functionCode,
        functionFile,
      } = state

      const file = codeOrFile === 'code' ? functionCode : functionFile

      await manager.add({
        runtime,
        name,
        tags,
        envVars,
        specs,
        volumes,
        isPersistent,
        // @todo: Move this to a new FunctionCode component that will always return
        // a file and an entrypoint depending on the selected language and code
        file,
      })

      router.replace('/dashboard')
    },
    [manager, router],
  )

  const {
    state: formState,
    setFormValue,
    handleSubmit,
  } = useForm({ initialState, onSubmit })

  const handleChangeFunctionRuntime = useCallback(
    (runtime: FunctionRuntimeProp) => setFormValue('runtime', runtime),
    [setFormValue],
  )

  const handleChangeInstanceSpecs = useCallback(
    (specs: InstanceSpecsProp) => setFormValue('specs', specs),
    [setFormValue],
  )

  const handleChangeVolumes = useCallback(
    (volumes: VolumeProp[]) => setFormValue('volumes', volumes),
    [setFormValue],
  )

  const handleChangeEnvVars = useCallback(
    (envVars: EnvVarProp[]) => setFormValue('envVars', envVars),
    [setFormValue],
  )

  const handleChangeNameAndTags = useCallback(
    ({ name, tags }: NameAndTagsProp) => {
      setFormValue('name', name)
      setFormValue('tags', tags)
    },
    [setFormValue],
  )

  const { totalCost } = useMemo(
    () =>
      getTotalProductCost({
        cpu: formState.specs?.cpu,
        isPersistentVM: formState.isPersistent,
        volumes: formState.volumes,
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
    handleChangeFunctionRuntime,
    handleChangeInstanceSpecs,
    handleChangeVolumes,
    handleChangeEnvVars,
    handleChangeNameAndTags,
  }
}
