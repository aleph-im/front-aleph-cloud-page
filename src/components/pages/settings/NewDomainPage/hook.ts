import { FormEvent, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useForm } from '@/hooks/common/useForm'
import { useDomainManager } from '@/hooks/common/useManager/useDomainManager'
import { useAppState } from '@/contexts/appState'
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
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { EntityAddAction } from '@/store/entity'
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
  nameCtrl: UseControllerReturn<NewDomainFormState, 'name'>
  targetCtrl: UseControllerReturn<NewDomainFormState, 'target'>
  refCtrl: UseControllerReturn<NewDomainFormState, 'ref'>
  errors: FieldErrors<NewDomainFormState>
  handleSubmit: (e: FormEvent) => Promise<void>
  handleBack: () => void
  setTarget: (target: EntityDomainType) => void
  setRef: (ref: string) => void
}

export function useNewDomainPage(): UseNewDomainPageReturn {
  const router = useRouter()
  const { name } = router.query
  const [
    {
      instance: { entities: instances },
      program: { entities: programs },
      website: { entities: websites },
      confidential: { entities: confidentials },
    },
    dispatch,
  ] = useAppState()

  const manager = useDomainManager()
  const { next, stop } = useCheckoutNotification({})

  const defaultFields = useMemo(() => {
    return {
      ...defaultValues,
      ...(typeof name === 'string' ? { name } : {}),
    }
  }, [name])

  const onSubmit = useCallback(
    async (state: NewDomainFormState) => {
      if (!manager) throw Err.ConnectYourWallet

      const iSteps = await manager.getAddSteps(state, 'override')
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = manager.addSteps(state, 'override')

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

        dispatch(
          new EntityAddAction({ name: 'domain', entities: accountDomain }),
        )

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
    defaultValues: defaultFields,
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    if (!entityType) return []
    if (entityType !== EntityDomainType.IPFS) {
      const entities =
        entityType === EntityDomainType.Instance
          ? instances
          : entityType === EntityDomainType.Confidential
            ? confidentials
            : programs
      return (entities || []).map(({ id, metadata }) => {
        return {
          label: (metadata?.name as string | undefined) || id,
          value: id,
          type: entityType,
        }
      })
    }
    return (websites || []).map(({ id, volume_id }) => {
      return {
        label: id,
        value: volume_id,
        type: entityType,
      }
    })
  }, [entityType, instances, programs, websites, confidentials])

  const hasInstances = useMemo(() => !!instances?.length, [instances])
  const hasFunctions = useMemo(() => !!programs?.length, [programs])
  const hasWebsites = useMemo(() => !!websites?.length, [websites])
  const hasConfidentials = useMemo(
    () => !!confidentials?.length,
    [confidentials],
  )
  /* const hasEntities = useMemo(
    () => hasInstances || hasFunctions || hasWebsites,
    [hasFunctions, hasInstances, hasWebsites],
  ) */

  useEffect(() => {
    if (entityType === EntityDomainType.Instance && hasInstances) {
      setValue('target', EntityDomainType.Instance)
    } else if (
      entityType === EntityDomainType.Confidential &&
      hasConfidentials
    ) {
      setValue('target', EntityDomainType.Confidential)
    } else if (entityType === EntityDomainType.Program && hasFunctions) {
      setValue('target', EntityDomainType.Program)
    } else if (entityType === EntityDomainType.IPFS) {
      setValue('target', EntityDomainType.IPFS)
    }
  }, [
    entityType,
    hasFunctions,
    hasInstances,
    hasConfidentials,
    hasWebsites,
    setValue,
  ])

  const setTarget = (target: EntityDomainType) => {
    setValue('target', target)
  }
  const setRef = (ref: string) => {
    setValue('ref', ref)
  }

  const handleBack = () => {
    router.push('/settings/')
  }

  return {
    entities,
    nameCtrl,
    targetCtrl,
    refCtrl,
    errors,
    handleSubmit,
    handleBack,
    setTarget,
    setRef,
  }
}
