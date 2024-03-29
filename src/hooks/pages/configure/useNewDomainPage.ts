import { FormEvent, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useForm } from '@/hooks/common/useForm'
import { useDomainManager } from '@/hooks/common/useManager/useDomainManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { DomainManager } from '@/domain/domain'
import { EntityType, AddDomainTarget } from '@/helpers/constants'
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
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'

export type NewDomainFormState = DomainField

export const defaultValues: NewDomainFormState = {
  ...defaultDomain,
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
  ipfsRefCtrl: UseControllerReturn<NewDomainFormState, 'ref'>
  errors: FieldErrors<NewDomainFormState>
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useNewDomainPage(): UseNewDomainPageReturn {
  const router = useRouter()
  const [{ accountInstances, accountFunctions }, dispatch] = useAppState()

  const manager = useDomainManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewDomainFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const iSteps = await manager.getSteps(state)
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = manager.addSteps(state)

      try {
        let accountDomain

        while (!accountDomain) {
          const { value, done } = await steps.next()

          if (done) {
            accountDomain = value[0]
            break
          }

          await next(nSteps)
        }

        dispatch({
          type: ActionTypes.addAccountDomain,
          payload: { accountDomain },
        })

        await router.replace('/')
      } finally {
        await stop()
      }
    },
    [dispatch, manager, next, router, stop],
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

  const programTypeCtrl = useController({
    control,
    name: 'programType',
    rules: {
      onChange(state) {
        setValue('ref', '')

        if (state.target.value === EntityType.Program) {
          setValue('target', AddDomainTarget.Program)
        } else if (state.target.value === EntityType.Instance) {
          setValue('target', AddDomainTarget.Instance)
        }
      },
    },
  })

  const refCtrl = useController({
    control,
    name: 'ref',
  })

  const ipfsRefCtrl = useController({
    control,
    name: 'ref',
    rules: {
      onChange() {
        setValue('target', AddDomainTarget.IPFS)
      },
    },
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

  useEffect(() => {
    if (!hasInstances && !hasFunctions) return

    if (entityType === EntityType.Instance && !hasInstances) {
      setValue('programType', EntityType.Program)
    }

    if (entityType === EntityType.Program && !hasFunctions) {
      setValue('programType', EntityType.Instance)
    }
  }, [entityType, hasFunctions, hasInstances, setValue])

  return {
    entities,
    hasInstances,
    hasFunctions,
    hasEntities,
    nameCtrl,
    programTypeCtrl,
    refCtrl,
    ipfsRefCtrl,
    errors,
    handleSubmit,
  }
}
