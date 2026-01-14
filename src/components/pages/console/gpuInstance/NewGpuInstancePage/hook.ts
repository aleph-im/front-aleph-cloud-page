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
import { DomainField } from '@/hooks/form/useAddDomains'
import { AddInstance } from '@/domain/instance'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EntityType, PaymentMethod } from '@/helpers/constants'
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
import { ModalCardProps, TooltipProps, useModal } from '@aleph-front/core'
import { accountConnectionRequiredDisabledMessage } from './disabledMessages'
import useFetchTermsAndConditions, {
  TermsAndConditions,
} from '@/hooks/common/useFetchTermsAndConditions'
import { useDefaultTiers } from '@/hooks/common/pricing/useDefaultTiers'
import { useGpuInstanceManager } from '@/hooks/common/useManager/useGpuInstanceManager'
import { GpuInstanceManager } from '@/domain/gpuInstance'
import usePrevious from '@/hooks/common/usePrevious'
import { useCanAfford } from '@/hooks/common/useCanAfford'
import { useTopUpCreditsModal } from '@/components/modals/TopUpCreditsModal/hook'

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
  values: any
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
  modalOpen?: (info: ModalCardProps) => void
  modalClose?: () => void
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
  const modal = useModal()
  const modalOpen = modal?.open
  const modalClose = modal?.close

  const { handleOpen: handleOpenTopUpModal } = useTopUpCreditsModal()

  const router = useRouter()
  const { crn: queryCRN, gpu: queryGPU } = router.query

  const nodeRef = useRef<CRNSpecs | undefined>(undefined)
  const [selectedNode, setSelectedNode] = useState<CRNSpecs>()
  const [selectedModal, setSelectedModal] = useState<Modal>()

  // -------------------------
  // Request CRNs specs

  const { specs } = useRequestCRNSpecs()

  // @note: Set node depending on CRN
  const node: CRNSpecs | undefined = useMemo(() => {
    if (!specs) return
    if (!queryCRN || !queryGPU) return nodeRef.current
    if (typeof queryCRN !== 'string' || typeof queryGPU !== 'string')
      return nodeRef.current

    if (selectedNode) {
      nodeRef.current = selectedNode
    } else {
      const gpuDevice = specs[queryCRN]?.data?.compatible_available_gpus?.find(
        (gpu) => gpu.model === queryGPU,
      )

      if (gpuDevice && specs[queryCRN]?.data) {
        // Create a copy with all the required properties to satisfy type constraints
        const nodeData = { ...specs[queryCRN].data } as CRNSpecs
        nodeRef.current = { ...nodeData, selectedGpu: gpuDevice }
      }
    }

    return nodeRef.current
  }, [queryCRN, queryGPU, selectedNode, specs])

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
  // Tiers

  const { defaultTiers } = useDefaultTiers({
    type: EntityType.GpuInstance,
    gpuModel: selectedNode?.selectedGpu?.model,
  })

  // -------------------------
  // Checkout flow

  const manager = useGpuInstanceManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewGpuInstanceFormState) => {
      if (!manager) throw Err.ConnectYourWallet
      if (!account) throw Err.InvalidAccount
      if (!node) throw Err.InvalidNode
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

        await Router.replace('/console')
      } finally {
        await stop()
      }
    },
    [
      manager,
      account,
      node,
      nodeSpecs,
      defaultTiers,
      blockchain,
      handleConnect,
      dispatch,
      next,
      stop,
    ],
  )

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(GpuInstanceManager.addSchema),
    readyDeps: [],
  })

  const formValues = useWatch({ control }) as NewGpuInstanceFormState

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

  // Calculate minimum balance needed for 24 hours of runtime
  const minimumBalanceNeeded = useMemo(() => {
    if (!cost?.cost?.cost) return 0
    return cost.cost.cost * 24 // 24 hours minimum
  }, [cost?.cost?.cost])

  // Check if user has enough balance for at least 24 hours
  const hasEnoughBalanceForOneDay = useMemo(() => {
    return accountCreditBalance >= minimumBalanceNeeded
  }, [accountCreditBalance, minimumBalanceNeeded])

  // Calculate the amount needed to top up (if insufficient)
  const topUpAmount = useMemo(() => {
    if (hasEnoughBalanceForOneDay) return 0
    return minimumBalanceNeeded - accountCreditBalance
  }, [hasEnoughBalanceForOneDay, minimumBalanceNeeded, accountCreditBalance])

  // Checks if user can afford with current balance (4 hours as before)
  const hasEnoughBalance = useMemo(() => {
    if (!account) return false
    if (!isCreateButtonDisabled) return true
    return canAfford
  }, [account, canAfford, isCreateButtonDisabled])

  const createInstanceButtonTitle: UseNewGpuInstancePageReturn['createInstanceButtonTitle'] =
    useMemo(() => {
      if (!account) return 'Connect'
      if (!hasEnoughBalanceForOneDay) return 'Add balance'
      if (!hasEnoughBalance) return 'Insufficient Credits'

      return 'Create instance'
    }, [account, hasEnoughBalanceForOneDay, hasEnoughBalance])

  const createInstanceDisabled = useMemo(() => {
    return createInstanceButtonTitle !== 'Create instance'
  }, [createInstanceButtonTitle])

  // -------------------------
  // Handlers

  const handleSelectNode = useCallback(async () => {
    setSelectedModal(undefined)

    if (!selectedNode) return

    const { crn: queryCRN, gpu: queryGPU, ...rest } = router.query
    if (
      queryCRN === selectedNode.hash &&
      queryGPU === selectedNode.selectedGpu?.model
    )
      return

    Router.replace({
      query: selectedNode
        ? {
            ...rest,
            crn: selectedNode.hash,
            gpu: selectedNode.selectedGpu?.model,
          }
        : rest,
    })
  }, [router.query, selectedNode])

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

  // Handle submit - either create instance or open top-up modal
  const handleFormSubmit = useCallback(
    (e: FormEvent) => {
      if (createInstanceButtonTitle === 'Add balance') {
        e.preventDefault()
        handleOpenTopUpModal(topUpAmount)
        return Promise.resolve()
      }
      return handleSubmit(e)
    },
    [
      createInstanceButtonTitle,
      handleOpenTopUpModal,
      topUpAmount,
      handleSubmit,
    ],
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

  return {
    address,
    accountCreditBalance,
    blockchainName,
    createInstanceDisabled,
    createInstanceButtonTitle,
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
    modalOpen,
    modalClose,
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
