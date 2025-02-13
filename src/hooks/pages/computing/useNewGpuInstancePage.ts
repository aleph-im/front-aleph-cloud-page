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
import {
  createFromEVMAccount,
  isAccountSupported as isAccountPAYGCompatible,
  isBlockchainSupported as isBlockchainPAYGCompatible,
} from '@aleph-sdk/superfluid'
import { useForm } from '@/hooks/common/useForm'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import {
  defaultNameAndTags,
  NameAndTagsField,
} from '@/hooks/form/useAddNameAndTags'
import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import { VolumeField } from '@/hooks/form/useAddVolume'
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
import { EntityType, PaymentMethod } from '@/helpers/constants'
import { useEntityCost } from '@/hooks/common/useEntityCost'
import { useRequestCRNSpecs } from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { CRNSpecs, NodeLastVersions, NodeManager } from '@/domain/node'
import {
  defaultStreamDuration,
  StreamDurationField,
} from '@/hooks/form/useSelectStreamDuration'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { EntityAddAction } from '@/store/entity'
import { useConnection } from '@/hooks/common/useConnection'
import Err from '@/helpers/errors'
import { BlockchainId, blockchains } from '@/domain/connect/base'
import { PaymentConfiguration } from '@/domain/executable'
import { EVMAccount } from '@aleph-sdk/evm'
import { isBlockchainHoldingCompatible } from '@/domain/blockchain'
import { ModalCardProps, TooltipProps, useModal } from '@aleph-front/core'
import {
  unsupportedHoldingDisabledMessage,
  unsupportedStreamDisabledMessage,
  holderTierNotSupportedMessage,
} from '@/components/pages/computing/NewGpuInstancePage/disabledMessages'
import useFetchTermsAndConditions, {
  TermsAndConditions,
} from '@/hooks/common/useFetchTermsAndConditions'
import { useDefaultTiers } from '@/hooks/common/pricing/tiers/useDefaultTiers'
import { useRequestCRNLastVersion } from '@/hooks/common/useRequestEntity/useRequestCRNLastVersion'

export type NewGpuInstanceFormState = NameAndTagsField & {
  image: InstanceImageField
  specs: InstanceSpecsField
  sshKeys: SSHKeyField[]
  volumes?: VolumeField[]
  envVars?: EnvVarField[]
  domains?: DomainField[]
  systemVolumeSize: number
  nodeSpecs?: CRNSpecs
  paymentMethod: PaymentMethod
  streamDuration: StreamDurationField
  streamCost: number
  termsAndConditions?: string
}

export type Modal = 'node-list' | 'terms-and-conditions'

export type UseNewGpuInstancePageReturn = {
  address: string
  accountBalance: number
  blockchainName: string
  createInstanceDisabled: boolean
  createInstanceDisabledMessage?: TooltipProps['content']
  createInstanceButtonTitle?: string
  streamDisabled: boolean
  disabledStreamDisabledMessage?: TooltipProps['content']
  values: any
  control: Control<any>
  errors: FieldErrors<NewGpuInstanceFormState>
  node?: CRNSpecs
  lastVersion?: NodeLastVersions
  nodeSpecs?: CRNSpecs
  selectedModal?: Modal
  setSelectedModal: (modal?: Modal) => void
  selectedNode?: string
  setSelectedNode: (hash?: string) => void
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
    balance: accountBalance = 0,
    handleConnect,
  } = useConnection({
    triggerOnMount: false,
  })
  const modal = useModal()
  const modalOpen = modal?.open
  const modalClose = modal?.close

  const router = useRouter()
  const { crn: queryCRN } = router.query

  const hasInitialized = useRef(false)
  const nodeRef = useRef<CRNSpecs | undefined>(undefined)
  const [selectedNode, setSelectedNode] = useState<string>()
  const [selectedModal, setSelectedModal] = useState<Modal>()

  // -------------------------
  // Request CRNs specs

  const { specs } = useRequestCRNSpecs()
  const { lastVersion } = useRequestCRNLastVersion()

  // @note: Set node depending on CRN
  const node: CRNSpecs | undefined = useMemo(() => {
    if (!specs) return
    if (!queryCRN) return nodeRef.current
    if (typeof queryCRN !== 'string') return nodeRef.current

    nodeRef.current = specs[queryCRN]
    return nodeRef.current
  }, [queryCRN, specs])

  const nodeSpecs = useMemo(() => {
    if (!node) return
    if (!specs) return

    return specs[node.hash]
  }, [specs, node])

  // -------------------------
  // Terms and conditions

  const { termsAndConditions } = useFetchTermsAndConditions({
    termsAndConditionsMessageHash: node?.terms_and_conditions,
  })

  // -------------------------
  // Tiers

  const { defaultTiers } = useDefaultTiers({ type: EntityType.Instance })

  // -------------------------
  // Checkout flow

  const manager = useInstanceManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewGpuInstanceFormState) => {
      if (!manager) throw Err.ConnectYourWallet
      if (!account) throw Err.InvalidAccount

      let superfluidAccount
      let payment: PaymentConfiguration = {
        chain: BlockchainId.ETH,
        type: PaymentMethod.Hold,
      }

      if (state.paymentMethod === PaymentMethod.Stream) {
        if (!node || !node.stream_reward) throw Err.InvalidNode
        if (!nodeSpecs) throw Err.InvalidCRNSpecs
        if (!state?.streamCost) throw Err.InvalidStreamCost

        const [minSpecs] = defaultTiers
        const isValid = NodeManager.validateMinNodeSpecs(minSpecs, nodeSpecs)
        if (!isValid) throw Err.InvalidCRNSpecs

        if (
          !blockchain ||
          !isBlockchainPAYGCompatible(blockchain) ||
          !isAccountPAYGCompatible(account)
        ) {
          handleConnect({ blockchain: BlockchainId.BASE })
          throw Err.InvalidNetwork
        }

        superfluidAccount = await createFromEVMAccount(account as EVMAccount)

        payment = {
          chain: blockchain,
          type: PaymentMethod.Stream,
          sender: account.address,
          receiver: node.stream_reward,
          streamCost: state.streamCost,
          streamDuration: state.streamDuration,
        }
      }

      const instance = {
        ...state,
        payment,
        node: state.paymentMethod === PaymentMethod.Stream ? node : undefined,
      } as AddInstance

      const iSteps = await manager.getAddSteps(instance)
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = manager.addSteps(instance, superfluidAccount)

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

        await Router.replace('/')
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

  const defaultValues: Partial<NewGpuInstanceFormState> = {
    ...defaultNameAndTags,
    image: defaultInstanceImage,
    specs: defaultTiers[0],
    systemVolumeSize: defaultTiers[0]?.storage,
    paymentMethod: PaymentMethod.Stream,
    streamDuration: defaultStreamDuration,
    streamCost: Number.POSITIVE_INFINITY,
    termsAndConditions: undefined,
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(
      !node ? InstanceManager.addSchema : InstanceManager.addStreamSchema,
    ),
    readyDeps: [],
  })

  const formValues = useWatch({ control }) as NewGpuInstanceFormState

  // -------------------------

  const { storage } = formValues.specs
  const { systemVolumeSize } = formValues
  const { cost } = useEntityCost({
    entityType: EntityType.Instance,
    props: {
      specs: formValues.specs,
      volumes: formValues.volumes,
      streamDuration: formValues.streamDuration,
      paymentMethod: formValues.paymentMethod,
    },
  })

  // -------------------------
  // Memos

  const shouldRequestTermsAndConditions = useMemo(() => {
    return (
      !!node?.terms_and_conditions &&
      formValues.paymentMethod === PaymentMethod.Stream
    )
  }, [node, formValues.paymentMethod])

  const blockchainName = useMemo(() => {
    return blockchain ? blockchains[blockchain]?.name : 'Current network'
  }, [blockchain])

  const disabledStreamDisabledMessage: UseNewGpuInstancePageReturn['disabledStreamDisabledMessage'] =
    holderTierNotSupportedMessage()

  const streamDisabled = true

  const address = useMemo(() => account?.address || '', [account])

  // Checks if user can afford with current balance
  const hasEnoughBalance = useMemo(() => {
    if (!account) return false
    if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') return true

    return accountBalance >= (cost?.totalCost || Number.MAX_SAFE_INTEGER)
  }, [account, accountBalance, cost?.totalCost])

  const createInstanceDisabledMessage: UseNewGpuInstancePageReturn['createInstanceDisabledMessage'] =
    useMemo(() => {
      // Checks configuration for PAYG tier
      if (formValues.paymentMethod === PaymentMethod.Stream) {
        if (!isBlockchainPAYGCompatible(blockchain))
          return unsupportedStreamDisabledMessage(blockchainName)
      }

      // Checks configuration for Holder tier
      if (formValues.paymentMethod === PaymentMethod.Hold) {
        if (!isBlockchainHoldingCompatible(blockchain))
          return unsupportedHoldingDisabledMessage(blockchainName)
      }
    }, [blockchain, blockchainName, formValues.paymentMethod])

  const createInstanceButtonTitle: UseNewGpuInstancePageReturn['createInstanceButtonTitle'] =
    useMemo(() => {
      if (!account) return 'Connect'
      if (!hasEnoughBalance) return 'Insufficient ALEPH'

      return 'Create instance'
    }, [account, hasEnoughBalance])

  const createInstanceDisabled = useMemo(() => {
    if (createInstanceButtonTitle !== 'Create instance') return true

    return !!createInstanceDisabledMessage
  }, [createInstanceButtonTitle, createInstanceDisabledMessage])

  // -------------------------
  // Handlers

  const handleSelectNode = useCallback(async () => {
    setSelectedModal(undefined)

    if (!selectedNode) return

    const { crn: queryCRN, ...rest } = router.query
    if (queryCRN === selectedNode) return

    Router.replace({
      query: selectedNode ? { ...rest, crn: selectedNode } : rest,
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

  // -------------------------
  // Effects

  // @note: First time the user loads the page, set payment method to Stream if CRN is present
  useEffect(() => {
    if (hasInitialized.current) return
    if (!router.isReady) return

    hasInitialized.current = true

    if (queryCRN) setValue('paymentMethod', PaymentMethod.Stream)
  }, [queryCRN, router.isReady, setValue])

  // @note: Updates url depending on payment method
  useEffect(() => {
    if (!node) return

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { crn, ...rest } = Router.query

    Router.replace({
      query:
        formValues.paymentMethod === PaymentMethod.Hold
          ? { ...rest }
          : { ...rest, crn: node.hash },
    })
  }, [node, formValues.paymentMethod])

  // @note: Change default System fake volume size when the specs changes
  useEffect(() => {
    if (!storage) return
    if (systemVolumeSize === storage) return

    setValue('systemVolumeSize', storage)
  }, [storage, setValue, systemVolumeSize])

  // @note: Set nodeSpecs
  useEffect(() => {
    setValue('nodeSpecs', nodeSpecs)
  }, [nodeSpecs, setValue])

  // @note: Set streamCost
  useEffect(() => {
    if (!cost) return
    if (formValues.streamCost === cost.totalStreamCost) return

    setValue('streamCost', cost.totalStreamCost)
  }, [cost, setValue, formValues])

  return {
    address,
    accountBalance,
    blockchainName,
    createInstanceDisabled,
    createInstanceDisabledMessage,
    createInstanceButtonTitle,
    values: formValues,
    control,
    errors,
    node,
    lastVersion,
    nodeSpecs,
    streamDisabled,
    disabledStreamDisabledMessage,
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
    handleSubmit,
    handleCloseModal,
    handleBack,
    handleRequestTermsAndConditionsAgreement,
    handleCheckTermsAndConditions,
    handleAcceptTermsAndConditions,
  }
}
