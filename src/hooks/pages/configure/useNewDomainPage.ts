import { FormEvent, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useForm } from '@/hooks/common/useForm'
import { useDomainManager } from '@/hooks/common/useManager/useDomainManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { DomainManager } from '@/domain/domain'
import { EntityDomainType } from '@/helpers/constants'
import {
  FieldErrors,
  UseControllerReturn,
  useController,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DomainField,
  defaultValues as defaultDomain,
} from '@/hooks/form/useAddDomains'
import Err from '@/helpers/errors'

export type NewDomainFormState = DomainField

export const defaultValues: NewDomainFormState = {
  ...defaultDomain,
}

export type DomainRefOptions = {
  label: string
  value: string
  type: EntityDomainType
}

export type UseNewDomainPageReturn = {
  entities: DomainRefOptions[]
  hasInstances: boolean
  hasFunctions: boolean
  hasEntities: boolean
  nameCtrl: UseControllerReturn<NewDomainFormState, 'name'>
  targetCtrl: UseControllerReturn<NewDomainFormState, 'target'>
  refCtrl: UseControllerReturn<NewDomainFormState, 'ref'>
  errors: FieldErrors<NewDomainFormState>
  handleSubmit: (e: FormEvent) => Promise<void>
  setTarget: (target: EntityDomainType) => void
}

export function useNewDomainPage(): UseNewDomainPageReturn {
  const router = useRouter()
  const manager = useDomainManager()
  const [{ accountInstances, accountFunctions, accountWebsites }, dispatch] =
    useAppState()

  const onSubmit = useCallback(
    async (state: NewDomainFormState) => {
      if (!manager) throw Err.ConnectYourWallet

      const [accountDomain] = await manager.add(state)

      dispatch({
        type: ActionTypes.addAccountDomain,
        payload: { accountDomain },
      })

      router.replace('/')
    },
    [dispatch, manager, router],
  )

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(DomainManager.addSchema),
  })

  const nameCtrl = useController({
    control,
    name: 'name',
  })

  const targetCtrl = useController({
    control,
    name: 'target',
    rules: {
      onChange(state) {
        setValue('ref', '')
      },
    },
  })

  const refCtrl = useController({
    control,
    name: 'ref',
  })

  const entityType = targetCtrl.field.value

  const entities = useMemo(() => {
    const entities = !entityType
      ? []
      : entityType === EntityDomainType.Instance
        ? accountInstances
        : entityType === EntityDomainType.Program
          ? accountFunctions
          : accountWebsites

    return (entities || []).map(({ id, metadata, type }) => {
      return {
        label: (metadata?.name as string | undefined) || id,
        value: id,
        type,
      }
    })
  }, [entityType, accountInstances, accountFunctions, accountWebsites])

  const hasInstances = useMemo(
    () => !!accountInstances?.length,
    [accountInstances],
  )

  const hasFunctions = useMemo(
    () => !!accountFunctions?.length,
    [accountFunctions],
  )

  useEffect(() => {
    if (entityType === EntityDomainType.Instance && hasInstances) {
      setValue('target', EntityDomainType.Instance)
    } else if (entityType === EntityDomainType.Program && hasFunctions) {
      setValue('target', EntityDomainType.Program)
    } else if (entityType === EntityDomainType.IPFS) {
      setValue('target', EntityDomainType.IPFS)
    }
  }, [entityType, hasFunctions, hasInstances, setValue])

  const setTarget = (target: EntityDomainType) => {
    setValue('target', target)
  }

  return {
    entities,
    nameCtrl,
    targetCtrl,
    refCtrl,
    errors,
    handleSubmit,
    setTarget,
  }
}
