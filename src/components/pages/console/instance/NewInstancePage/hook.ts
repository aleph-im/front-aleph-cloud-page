import { useAppState } from '@/contexts/appState'
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Router, { useRouter } from 'next/router'
import { useForm } from '@/hooks/common/useForm'
import {
  defaultNameAndTags,
  NameAndTagsField,
} from '@/hooks/form/useAddNameAndTags'
import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import {
  InstanceSystemVolumeField,
  VolumeField,
} from '@/hooks/form/useAddVolume'
import {
  defaultInstanceImage,
  InstanceImageField,
} from '@/hooks/form/useSelectInstanceImage'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { DomainField } from '@/hooks/form/useAddDomains'
import { AddInstance, InstanceManager } from '@/domain/instance'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EntityType, NAVIGATION_URLS, PaymentMethod } from '@/helpers/constants'
import {
  useEntityCost,
  UseEntityCostReturn,
  UseInstanceCostProps,
} from '@/hooks/common/useEntityCost'
import { CRNSpecs, NodeLastVersions, NodeManager } from '@/domain/node'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { EntityAddAction } from '@/store/entity'
import { useConnection } from '@/hooks/common/useConnection'
import Err from '@/helpers/errors'
import { BlockchainId } from '@/domain/connect'
import {
  CreditPaymentConfiguration,
  PaymentConfiguration,
} from '@/domain/executable'
import { TooltipProps } from '@aleph-front/core'
import { accountConnectionRequiredDisabledMessage } from './disabledMessages'
import useFetchTermsAndConditions, {
  TermsAndConditions,
} from '@/hooks/common/useFetchTermsAndConditions'
import { useDefaultTiers } from '@/hooks/common/pricing/useDefaultTiers'
import { useRequestCRNLastVersion } from '@/hooks/common/useRequestEntity/useRequestCRNLastVersion'
import usePrevious from '@/hooks/common/usePrevious'
import { useCanAfford } from '@/hooks/common/useCanAfford'
import {
  useInsufficientFunds,
  InsufficientFundsInfo,
} from '@/hooks/common/useInsufficientFunds'
import {
  useAggregatedNodeSpecs,
  AggregatedNodeSpecs,
} from '@/hooks/common/useAggregatedNodeSpecs'
import { useAutoSelectNode } from '@/hooks/common/useAutoSelectNode'
import { useRequestCRNSpecs } from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { useStableValue } from '@/hooks/common/useStableValue'

export type NewInstanceFormState = NameAndTagsField & {
  image: InstanceImageField
  specs: InstanceSpecsField
  sshKeys: SSHKeyField[]
  volumes?: VolumeField[]
  domains?: DomainField[]
  systemVolume: InstanceSystemVolumeField
  nodeSpecs?: CRNSpecs
  paymentMethod: PaymentMethod
  termsAndConditions?: string
}

export type Modal = 'node-list' | 'terms-and-conditions'

export type CRNReservationStatus = 'idle' | 'checking' | 'reserved' | 'failed'

export type CRNReservationState = {
  status: CRNReservationStatus
  /** Hash of the node the current reservation result refers to. */
  nodeHash?: string
  /** Specs signature the reservation was made for; invalidated when it changes. */
  specsKey?: string
  /** Set when no compatible CRN could fit the selected resources. */
  error?: string
  /** Set when a manually selected CRN was at capacity and got switched. */
  warning?: string
}

export type UseNewInstancePageReturn = {
  address: string
  accountCreditBalance: number
  manuallySelectCRNDisabled: boolean
  manuallySelectCRNDisabledMessage?: TooltipProps['content']
  createInstanceDisabled: boolean
  createInstanceButtonTitle: string
  minimumBalanceNeeded: number
  insufficientFundsInfo?: InsufficientFundsInfo
  values: NewInstanceFormState
  control: Control<any>
  errors: FieldErrors<NewInstanceFormState>
  cost: UseEntityCostReturn
  node?: CRNSpecs
  lastVersion?: NodeLastVersions
  nodeSpecs?: CRNSpecs
  selectedModal?: Modal
  setSelectedModal: (modal?: Modal) => void
  selectedNode?: CRNSpecs
  setSelectedNode: (hash?: CRNSpecs) => void
  termsAndConditions?: TermsAndConditions
  shouldRequestTermsAndConditions: boolean
  aggregatedSpecs?: AggregatedNodeSpecs
  compatibleNodesCount: number
  reservation: CRNReservationState
  handleManuallySelectCRN: () => void
  handleSelectNode: () => void
  handleRequestTermsAndConditionsAgreement: () => void
  handleCheckTermsAndConditions: () => void
  handleAcceptTermsAndConditions: (e: FormEvent) => void
  handleSubmit: (e: FormEvent) => Promise<void>
  handleCloseModal: () => void
  handleBack: () => void
}

export function useNewInstancePage(): UseNewInstancePageReturn {
  const [, dispatch] = useAppState()

  const {
    blockchain,
    account,
    creditBalance: accountCreditBalance = 0,
    handleConnect,
  } = useConnection({
    triggerOnMount: false,
  })

  const router = useRouter()

  const [selectedNode, setSelectedNode] = useState<CRNSpecs>()
  const [selectedModal, setSelectedModal] = useState<Modal>()
  const [manuallySelectedNode, setManuallySelectedNode] = useState<CRNSpecs>()
  const [reservation, setReservation] = useState<CRNReservationState>({
    status: 'idle',
  })
  // Prevents overlapping reservation requests (concurrent Create clicks).
  const reservingRef = useRef(false)
  // Invalidates in-flight reservations when the specs/tier change.
  const reservationGenRef = useRef(0)

  // -------------------------
  // Request CRNs specs and aggregated specs
  const { specs } = useRequestCRNSpecs()
  const { lastVersion } = useRequestCRNLastVersion()
  const { aggregatedSpecs, validNodes } = useAggregatedNodeSpecs()

  // -------------------------
  // Tiers

  const { defaultTiers } = useDefaultTiers({ type: EntityType.Instance })

  // -------------------------
  // Setup form

  const defaultValues: Partial<NewInstanceFormState> = useMemo(
    () => ({
      ...defaultNameAndTags,
      image: defaultInstanceImage,
      specs: defaultTiers[0],
      systemVolume: { size: defaultTiers[0]?.storage },
      paymentMethod: PaymentMethod.Credit,
      termsAndConditions: undefined,
    }),
    [defaultTiers],
  )

  // -------------------------
  // Checkout flow

  const manager = useInstanceManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewInstanceFormState, node: CRNSpecs | undefined) => {
      if (!manager) throw Err.ConnectYourWallet
      if (!account) throw Err.InvalidAccount

      // A node is only present when manually selected; validate it against the
      // tier. With no node the network assigns a compatible CRN server-side.
      if (node) {
        const nodeSpecs = specs[node.hash]?.data
        if (!nodeSpecs) throw Err.InvalidCRNSpecs

        const [minSpecs] = defaultTiers
        const isValid = NodeManager.validateMinNodeSpecs(minSpecs, nodeSpecs)
        if (!isValid) throw Err.InvalidCRNSpecs
      }

      if (!blockchain) {
        handleConnect({ blockchain: BlockchainId.BASE })
        throw Err.InvalidNetwork
      }

      const payment: CreditPaymentConfiguration = {
        chain: blockchain,
        type: PaymentMethod.Credit,
      }

      const instance = {
        ...state,
        payment,
        node,
      } as AddInstance

      const iSteps = await manager.getAddSteps(instance)
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = manager.addSteps(instance)

      try {
        let accountInstance

        while (!accountInstance) {
          const { value, done } = await steps.next()

          if (done) {
            accountInstance = value
            break
          }

          await next(nSteps)
        }

        // @todo: Check new volumes and domains being created to add them to the store
        dispatch(
          new EntityAddAction({ name: 'instance', entities: accountInstance }),
        )

        await Router.replace(
          NAVIGATION_URLS.console.computing.instances.detail(
            accountInstance.id,
          ),
        )
      } finally {
        await stop()
      }
    },
    [
      manager,
      account,
      specs,
      defaultTiers,
      blockchain,
      handleConnect,
      dispatch,
      next,
      stop,
    ],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
    onSubmit: (state: NewInstanceFormState) => onSubmit(state, node),
    resolver: zodResolver(InstanceManager.addSchema),
    readyDeps: [],
  })

  const formValues = useWatch({ control }) as NewInstanceFormState

  // -------------------------
  // Auto-select node based on selected tier

  // Stabilize specs to prevent infinite loops from object reference changes
  const specsKey = formValues.specs
    ? `${formValues.specs.cpu}-${formValues.specs.ram}-${formValues.specs.storage}`
    : ''
  const stableSpecs = useStableValue(formValues.specs, specsKey)

  const { compatibleNodes, compatibleNodesCount } = useAutoSelectNode({
    selectedSpecs: stableSpecs,
    validNodes,
    enabled: false,
  })

  // The node is only set when the user manually selects a CRN in the advanced
  // options; otherwise the network assigns it (no node_hash in the message).
  const node: CRNSpecs | undefined = manuallySelectedNode

  const nodeSpecs = useMemo(() => {
    if (!node) return
    if (!specs) return

    return specs[node.hash]?.data
  }, [specs, node])

  // -------------------------
  // CRN resource reservation (pre-flight capacity check)

  const buildAddInstance = useCallback(
    (candidate: CRNSpecs): AddInstance =>
      ({
        ...formValues,
        payment: {
          chain: blockchain,
          type: PaymentMethod.Credit,
        },
        node: candidate,
      }) as AddInstance,
    [formValues, blockchain],
  )

  // Reserves resources on `preferredNode`; if it cannot fit the specs, falls
  // back to the next compatible node (highest score first). When a manually
  // selected node gets switched, surfaces a warning. Returns the node that the
  // CRN actually reserved, or undefined when none has capacity.
  const resolveReservation = useCallback(
    async (preferredNode: CRNSpecs): Promise<CRNSpecs | undefined> => {
      if (!manager) return undefined
      // Ignore overlapping requests so concurrent clicks don't reserve on
      // several nodes at once.
      if (reservingRef.current) return undefined

      reservingRef.current = true
      // Anything started under a previous generation (e.g. before a tier
      // change) is stale and must not write state or pin a node.
      const gen = ++reservationGenRef.current
      const isStale = () => reservationGenRef.current !== gen

      try {
        setReservation({
          status: 'checking',
          nodeHash: preferredNode.hash,
          specsKey,
        })

        // One wallet signature, cached for the per-node reservations below.
        try {
          await manager.ensureAuthToken()
        } catch (e) {
          if (!isStale())
            setReservation({
              status: 'failed',
              nodeHash: preferredNode.hash,
              specsKey,
              error: (e as Error).message,
            })
          return undefined
        }

        const candidates = [
          preferredNode,
          ...compatibleNodes.filter((n) => n.hash !== preferredNode.hash),
        ]

        for (const candidate of candidates) {
          const { reserved } = await manager.reserveResourcesForNode(
            buildAddInstance(candidate),
          )
          if (isStale()) return undefined
          if (!reserved) continue

          const switched = candidate.hash !== preferredNode.hash
          if (switched) {
            setManuallySelectedNode(candidate)
          }

          setReservation({
            status: 'reserved',
            nodeHash: candidate.hash,
            specsKey,
            warning: switched
              ? 'The CRN you selected could not fit the selected resources. A compatible node was selected instead — review and create.'
              : undefined,
          })
          return candidate
        }

        if (!isStale())
          setReservation({
            status: 'failed',
            nodeHash: preferredNode.hash,
            specsKey,
            error: 'No compatible CRN has enough free resources right now.',
          })
        return undefined
      } finally {
        reservingRef.current = false
      }
    },
    [manager, specsKey, compatibleNodes, buildAddInstance],
  )

  // -------------------------
  // Terms and conditions

  const { termsAndConditions } = useFetchTermsAndConditions({
    termsAndConditionsMessageHash: node?.terms_and_conditions,
  })

  // -------------------------

  const { storage } = formValues.specs || {}
  const { size: systemVolumeSize } = formValues.systemVolume

  const payment: PaymentConfiguration = useMemo(() => {
    return {
      chain: blockchain,
      type: PaymentMethod.Credit,
    } as CreditPaymentConfiguration
  }, [blockchain])

  const costProps: UseInstanceCostProps = useMemo(
    () => ({
      entityType: EntityType.Instance,
      props: {
        node,
        specs: formValues.specs,
        volumes: formValues.volumes,
        domains: formValues.domains,
        paymentMethod: formValues.paymentMethod,
        payment,
        isPersistent: true,
        image: formValues.image,
        systemVolume: formValues.systemVolume,
        name: formValues.name || 'MOCK',
        sshKeys: formValues.sshKeys || [
          { key: 'MOCK', isNew: true, isSelected: true },
        ],
      },
    }),
    [node, payment, formValues],
  )

  const cost = useEntityCost(costProps)

  // -------------------------
  // Memos

  const shouldRequestTermsAndConditions = useMemo(() => {
    return !!node?.terms_and_conditions
  }, [node])

  const address = useMemo(() => account?.address || '', [account])

  const manuallySelectCRNDisabledMessage: UseNewInstancePageReturn['manuallySelectCRNDisabledMessage'] =
    useMemo(() => {
      if (!account)
        return accountConnectionRequiredDisabledMessage(
          'manually selecting CRNs',
        )
    }, [account])

  const manuallySelectCRNDisabled = useMemo(() => {
    return !!manuallySelectCRNDisabledMessage
  }, [manuallySelectCRNDisabledMessage])

  const { canAfford, isCreateButtonDisabled } = useCanAfford({
    cost,
    accountCreditBalance,
  })

  // Insufficient funds handling (24-hour minimum balance check)
  const {
    isDisabledDueToInsufficientFunds,
    minimumBalanceNeeded,
    insufficientFundsInfo,
  } = useInsufficientFunds({
    cost,
    accountCreditBalance,
    isConnected: !!account,
  })

  // Checks if user can afford with current balance (4 hours as before)
  const hasEnoughBalance = useMemo(() => {
    if (!account) return false
    if (!isCreateButtonDisabled) return true
    return canAfford
  }, [account, canAfford, isCreateButtonDisabled])

  const createInstanceButtonTitle: UseNewInstancePageReturn['createInstanceButtonTitle'] =
    useMemo(() => {
      if (!account) return 'Connect'
      if (!hasEnoughBalance) return 'Insufficient Credits'

      return 'Create instance'
    }, [account, hasEnoughBalance])

  const createInstanceDisabled = useMemo(() => {
    if (!account) return true
    if (isDisabledDueToInsufficientFunds) return true
    if (!hasEnoughBalance) return true
    // Avoid overlapping reservations from repeated clicks.
    if (reservation.status === 'checking') return true
    return false
  }, [
    account,
    isDisabledDueToInsufficientFunds,
    hasEnoughBalance,
    reservation.status,
  ])

  // -------------------------
  // Handlers

  const handleSelectNode = useCallback(async () => {
    setSelectedModal(undefined)

    if (!selectedNode) return

    setManuallySelectedNode(selectedNode)

    // Reserve right away so the user learns immediately if the chosen CRN
    // cannot fit the selected resources.
    await resolveReservation(selectedNode)
  }, [selectedNode, resolveReservation])

  const handleManuallySelectCRN = useCallback(() => {
    setSelectedModal('node-list')
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedModal(undefined)
  }, [])

  const handleRequestTermsAndConditionsAgreement = useCallback(() => {
    setSelectedModal('terms-and-conditions')
  }, [])

  const handleCheckTermsAndConditions = useCallback(() => {
    formValues.termsAndConditions
      ? setValue('termsAndConditions', undefined)
      : setValue('termsAndConditions', node?.terms_and_conditions)
  }, [formValues.termsAndConditions, node, setValue])

  const handleBack = () => {
    router.push('.')
  }

  // Handle submit: reserve CRN capacity before signing (see resolveReservation).
  const handleFormSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      // No manually selected CRN → the network assigns the node; nothing to
      // reserve, create straight away.
      if (!node) return handleSubmit(e)

      // Before signing, make sure the resources are reserved on the current
      // node for the current specs. If they already are, create straight away.
      const reservedForCurrent =
        reservation.status === 'reserved' &&
        reservation.nodeHash === node.hash &&
        reservation.specsKey === specsKey

      if (reservedForCurrent) return handleSubmit(e)

      const reservedNode = await resolveReservation(node)
      if (!reservedNode) return

      // Same node reserved → safe to create now. If it was switched, the new
      // node is pinned and the next Create click submits against it.
      if (reservedNode.hash === node.hash) return handleSubmit(e)
    },
    [node, reservation, specsKey, resolveReservation, handleSubmit],
  )

  // T&C-gated nodes must run the same reservation check before signing.
  const handleAcceptTermsAndConditions = useCallback(
    (e: React.FormEvent) => {
      handleCloseModal()
      handleFormSubmit(e)
    },
    [handleCloseModal, handleFormSubmit],
  )

  // -------------------------
  // Effects

  const prevStorage = usePrevious(storage)

  // @note: Change default System fake volume size when the specs changes
  useEffect(() => {
    if (!storage) return
    if (storage === prevStorage) return

    const newSize =
      systemVolumeSize === prevStorage
        ? storage
        : Math.max(storage, systemVolumeSize)

    setValue('systemVolume.size', newSize)
  }, [storage, prevStorage, setValue, systemVolumeSize])

  // @note: Set nodeSpecs (only when the hash changes to avoid infinite loops)
  const stableNodeSpecs = useStableValue(nodeSpecs, nodeSpecs?.hash)
  useEffect(() => {
    setValue('nodeSpecs', stableNodeSpecs)
  }, [stableNodeSpecs, setValue])

  // @note: Reset manual CRN selection when tier changes (user needs to re-select node)
  const prevSpecs = usePrevious(formValues.specs)
  useEffect(() => {
    if (!formValues.specs || !prevSpecs) return

    // If tier changed, drop any manual CRN selection and the reservation,
    // since the reservation was made for the previous specs.
    if (
      formValues.specs.cpu !== prevSpecs.cpu ||
      formValues.specs.ram !== prevSpecs.ram
    ) {
      setManuallySelectedNode(undefined)
      // Invalidate any in-flight reservation so its result is discarded.
      reservationGenRef.current++
      setReservation({ status: 'idle' })
    }
  }, [formValues.specs, prevSpecs])

  return {
    address,
    accountCreditBalance,
    createInstanceDisabled,
    createInstanceButtonTitle,
    minimumBalanceNeeded,
    insufficientFundsInfo,
    manuallySelectCRNDisabled,
    manuallySelectCRNDisabledMessage,
    values: formValues,
    control,
    errors,
    cost,
    node,
    lastVersion,
    nodeSpecs,
    selectedModal,
    setSelectedModal,
    selectedNode,
    setSelectedNode,
    termsAndConditions,
    shouldRequestTermsAndConditions,
    aggregatedSpecs,
    compatibleNodesCount,
    reservation,
    handleManuallySelectCRN,
    handleSelectNode,
    handleSubmit: handleFormSubmit,
    handleCloseModal,
    handleBack,
    handleRequestTermsAndConditionsAgreement,
    handleCheckTermsAndConditions,
    handleAcceptTermsAndConditions,
  }
}
