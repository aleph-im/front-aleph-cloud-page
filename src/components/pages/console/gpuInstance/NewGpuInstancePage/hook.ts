import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
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
import { DomainField } from '@/hooks/form/useAddDomains'
import { AddInstance } from '@/domain/instance'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EntityType, NAVIGATION_URLS, PaymentMethod } from '@/helpers/constants'
import {
  useEntityCost,
  UseEntityCostReturn,
  UseGpuInstanceCostProps,
} from '@/hooks/common/useEntityCost'
import { useRequestCRNSpecs } from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { CRNSpecs, NodeManager } from '@/domain/node'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { EntityAddAction } from '@/store/entity'
import { useConnection } from '@/hooks/common/useConnection'
import Err from '@/helpers/errors'
import { BlockchainId, blockchains } from '@/domain/connect'
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
import { useGpuInstanceManager } from '@/hooks/common/useManager/useGpuInstanceManager'
import { GpuInstanceManager } from '@/domain/gpuInstance'
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

export type NewGpuInstanceFormState = NameAndTagsField & {
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

export type UseNewGpuInstancePageReturn = {
  address: string
  accountCreditBalance: number
  blockchainName: string
  manuallySelectCRNDisabled: boolean
  manuallySelectCRNDisabledMessage?: TooltipProps['content']
  createInstanceDisabled: boolean
  createInstanceButtonTitle: string
  minimumBalanceNeeded: number
  insufficientFundsInfo?: InsufficientFundsInfo
  values: NewGpuInstanceFormState
  control: Control<any>
  errors: FieldErrors<NewGpuInstanceFormState>
  cost: UseEntityCostReturn
  node?: CRNSpecs
  nodeSpecs?: CRNSpecs
  selectedModal?: Modal
  setSelectedModal: (modal?: Modal) => void
  selectedNode?: CRNSpecs
  setSelectedNode: (node?: CRNSpecs) => void
  termsAndConditions?: TermsAndConditions
  shouldRequestTermsAndConditions: boolean
  aggregatedSpecs?: AggregatedNodeSpecs
  compatibleNodesCount: number
  manualNodeOverride: boolean
  handleManuallySelectCRN: () => void
  handleSelectNode: () => void
  handleRequestTermsAndConditionsAgreement: () => void
  handleCheckTermsAndConditions: () => void
  handleAcceptTermsAndConditions: (e: FormEvent) => void
  handleSubmit: (e: FormEvent) => Promise<void>
  handleCloseModal: () => void
  handleBack: () => void
}

export function useNewGpuInstancePage(): UseNewGpuInstancePageReturn {
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
  const [manualNodeOverride, setManualNodeOverride] = useState(false)
  const [manuallySelectedNode, setManuallySelectedNode] = useState<CRNSpecs>()

  // -------------------------
  // Request CRNs specs and aggregated specs

  const { specs } = useRequestCRNSpecs()
  const { aggregatedSpecs, validNodes } = useAggregatedNodeSpecs()

  // -------------------------
  // Tiers - use the selected GPU model to filter tiers

  const gpuModel = useMemo(() => {
    if (manuallySelectedNode?.selectedGpu?.model)
      return manuallySelectedNode.selectedGpu.model
    return selectedNode?.selectedGpu?.model
  }, [manuallySelectedNode, selectedNode])

  const { defaultTiers } = useDefaultTiers({
    type: EntityType.GpuInstance,
    gpuModel,
  })

  // -------------------------
  // Setup form

  const defaultValues: Partial<NewGpuInstanceFormState> = useMemo(
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

  const manager = useGpuInstanceManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewGpuInstanceFormState, node: CRNSpecs | undefined) => {
      if (!manager) throw Err.ConnectYourWallet
      if (!account) throw Err.InvalidAccount
      if (!node) throw Err.InvalidNode

      const nodeSpecs = specs[node.hash]?.data
      if (!nodeSpecs) throw Err.InvalidCRNSpecs

      const [minSpecs] = defaultTiers
      const isValid = NodeManager.validateMinNodeSpecs(minSpecs, nodeSpecs)
      if (!isValid) throw Err.InvalidCRNSpecs

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
          NAVIGATION_URLS.console.computing.gpus.detail(accountInstance.id),
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
    onSubmit: (state: NewGpuInstanceFormState) => onSubmit(state, node),
    resolver: zodResolver(GpuInstanceManager.addSchema),
    readyDeps: [],
  })

  const formValues = useWatch({ control }) as NewGpuInstanceFormState

  // -------------------------
  // Auto-select node based on selected tier and GPU model

  const { autoSelectedNode, compatibleNodes } = useAutoSelectNode({
    selectedSpecs: formValues.specs,
    validNodes,
    gpuModel,
    enabled: !manualNodeOverride && !!gpuModel,
  })

  // Final node: manual override takes precedence over auto-selected
  const node: CRNSpecs | undefined = useMemo(() => {
    if (manualNodeOverride && manuallySelectedNode) {
      return manuallySelectedNode
    }
    return autoSelectedNode
  }, [manualNodeOverride, manuallySelectedNode, autoSelectedNode])

  const nodeSpecs = useMemo(() => {
    if (!node) return
    if (!specs) return

    return specs[node.hash]?.data
  }, [specs, node])

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

  const costProps: UseGpuInstanceCostProps = useMemo(
    () => ({
      entityType: EntityType.GpuInstance,
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

  const blockchainName = useMemo(() => {
    return blockchain ? blockchains[blockchain]?.name : 'Current network'
  }, [blockchain])

  const manuallySelectCRNDisabledMessage: UseNewGpuInstancePageReturn['manuallySelectCRNDisabledMessage'] =
    useMemo(() => {
      if (!account)
        return accountConnectionRequiredDisabledMessage(
          'manually selecting CRNs',
        )
    }, [account])

  const manuallySelectCRNDisabled = useMemo(() => {
    return !!manuallySelectCRNDisabledMessage
  }, [manuallySelectCRNDisabledMessage])

  const address = useMemo(() => account?.address || '', [account])

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

  const createInstanceButtonTitle: UseNewGpuInstancePageReturn['createInstanceButtonTitle'] =
    useMemo(() => {
      if (!account) return 'Connect'
      if (!hasEnoughBalance) return 'Insufficient Credits'

      return 'Create instance'
    }, [account, hasEnoughBalance])

  const createInstanceDisabled = useMemo(() => {
    if (!account) return true
    if (isDisabledDueToInsufficientFunds) return true
    if (!hasEnoughBalance) return true
    return false
  }, [account, isDisabledDueToInsufficientFunds, hasEnoughBalance])

  // -------------------------
  // Handlers

  const handleSelectNode = useCallback(async () => {
    setSelectedModal(undefined)

    if (!selectedNode) return

    // Set manual override and the selected node
    setManualNodeOverride(true)
    setManuallySelectedNode(selectedNode)
  }, [selectedNode])

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

  const handleAcceptTermsAndConditions = useCallback(
    (e: React.FormEvent) => {
      handleCloseModal()
      handleSubmit(e)
    },
    [handleCloseModal, handleSubmit],
  )

  const handleBack = () => {
    router.push('.')
  }

  // Handle submit
  const handleFormSubmit = useCallback(
    (e: FormEvent) => {
      return handleSubmit(e)
    },
    [handleSubmit],
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

  // @note: Set nodeSpecs
  useEffect(() => {
    setValue('nodeSpecs', nodeSpecs)
  }, [nodeSpecs, setValue])

  // @note: Reset manual override when tier changes (user needs to re-select node)
  const prevSpecs = usePrevious(formValues.specs)
  useEffect(() => {
    if (!formValues.specs || !prevSpecs) return

    // If tier changed, reset manual override so auto-select kicks in
    if (
      formValues.specs.cpu !== prevSpecs.cpu ||
      formValues.specs.ram !== prevSpecs.ram
    ) {
      setManualNodeOverride(false)
      setManuallySelectedNode(undefined)
    }
  }, [formValues.specs, prevSpecs])

  return {
    address,
    accountCreditBalance,
    blockchainName,
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
    nodeSpecs,
    selectedModal,
    setSelectedModal,
    selectedNode,
    setSelectedNode,
    termsAndConditions,
    shouldRequestTermsAndConditions,
    aggregatedSpecs,
    compatibleNodesCount: compatibleNodes.length,
    manualNodeOverride,
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
