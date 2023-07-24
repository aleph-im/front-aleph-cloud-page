import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { useDomainManager } from '@/hooks/common/useManager/useDomainManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { AddDomain, AddDomainTarget } from '@/domain/domain'
import { EntityType } from '@/helpers/constants'

export type NewDomainFormState = AddDomain

export const initialState: NewDomainFormState = {
  name: '',
  ref: '',
  target: AddDomainTarget.Program,
}

export type DomainRefOptions = {
  label: string
  value: string
  type: EntityType
}

export type UseNewDomainPage = {
  formState: NewDomainFormState
  entityType: EntityType.Instance | EntityType.Program
  entities: DomainRefOptions[]
  hasInstances: boolean
  hasFunctions: boolean
  hasEntities: boolean
  handleSubmit: (e: FormEvent) => Promise<void>
  handleChangeName: (e: ChangeEvent<HTMLTextAreaElement>) => void
  handleChangeEntityType: (
    _: ChangeEvent<HTMLInputElement>,
    type: string,
  ) => void
  handleChangeRef: (e: ChangeEvent<HTMLInputElement>) => void
}

export function useNewDomainPage() {
  useConnectedWard()

  const router = useRouter()
  const manager = useDomainManager()
  const [{ accountInstances, accountFunctions }, dispatch] = useAppState()

  const [entityType, setEntityType] = useState<EntityType>()

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

  const {
    state: formState,
    setFormValue,
    handleSubmit,
  } = useForm({ initialState, onSubmit })

  const handleChangeName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setFormValue('name', e.target.value),
    [setFormValue],
  )

  const handleChangeRef = useCallback(
    (ref: string | string[]) => setFormValue('ref', ref as string),
    [setFormValue],
  )

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

  const handleChangeEntityType = useCallback(
    (_: ChangeEvent<HTMLInputElement>, type: unknown) => {
      setEntityType(type as EntityType)
      handleChangeRef('')
    },
    [handleChangeRef],
  )

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
    ...formState,
    entityType,
    entities,
    hasInstances,
    hasFunctions,
    hasEntities,
    handleChangeName,
    handleChangeEntityType,
    handleChangeRef,
    handleSubmit,
  }
}
