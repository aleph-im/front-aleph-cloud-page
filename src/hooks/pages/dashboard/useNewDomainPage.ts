import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { useDomainManager } from '@/hooks/common/useManager/useDomainManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { AddDomain, AddDomainTarget } from '@/domain/domain'
import { EntityType } from '@/helpers/constants'
import { UseControllerReturn, useController } from 'react-hook-form'
import { formValidationRules } from '@/helpers/errors'

export type NewDomainFormState = AddDomain

export const defaultValues: Partial<NewDomainFormState> = {
  target: AddDomainTarget.Program,
}

export type DomainRefOptions = {
  label: string
  value: string
  type: EntityType
}

export type UseNewDomainPageReturn = {
  entities: DomainRefOptions[]
  hasInstances: boolean
  hasFunctions: boolean
  hasEntities: boolean
  nameCtrl: UseControllerReturn<NewDomainFormState, 'name'>
  programTypeCtrl: UseControllerReturn<NewDomainFormState, 'programType'>
  refCtrl: UseControllerReturn<NewDomainFormState, 'ref'>
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useNewDomainPage(): UseNewDomainPageReturn {
  useConnectedWard()

  const router = useRouter()
  const manager = useDomainManager()
  const [{ accountInstances, accountFunctions }, dispatch] = useAppState()

  const onSubmit = useCallback(
    async (state: NewDomainFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const [accountDomain] = await manager.add(state)

      dispatch({
        type: ActionTypes.addAccountDomain,
        payload: { accountDomain },
      })

      router.replace('/dashboard')
    },
    [dispatch, manager, router],
  )

  const { control, handleSubmit, setValue } = useForm({
    defaultValues,
    onSubmit,
  })

  const { required } = formValidationRules

  const nameCtrl = useController({
    control,
    name: 'name',
    rules: { required },
  })

  const programTypeCtrl = useController({
    control,
    name: 'programType',
    rules: {
      required,
      onChange() {
        setValue('ref', '')
      },
    },
  })

  const refCtrl = useController({
    control,
    name: 'ref',
    rules: { required },
  })

  const entityType = programTypeCtrl.field.value

  const entities = useMemo(() => {
    const entities = !entityType
      ? []
      : entityType === EntityType.Instance
      ? accountInstances
      : accountFunctions

    return (entities || []).map(({ id, metadata, type }) => {
      return {
        label: (metadata?.name as string | undefined) || id,
        value: id,
        type,
      }
    })
  }, [entityType, accountInstances, accountFunctions])

  const hasInstances = useMemo(
    () => !!accountInstances?.length,
    [accountInstances],
  )

  const hasFunctions = useMemo(
    () => !!accountFunctions?.length,
    [accountFunctions],
  )

  const hasEntities = useMemo(
    () => hasInstances || hasFunctions,
    [hasFunctions, hasInstances],
  )

  return {
    entities,
    hasInstances,
    hasFunctions,
    hasEntities,
    nameCtrl,
    programTypeCtrl,
    refCtrl,
    handleSubmit,
  }
}
