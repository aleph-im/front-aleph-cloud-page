import { useAppState } from '@/contexts/appState'
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/router'
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
import { SSHKeyField, useAccountSSHKeyItems } from '@/hooks/form/useAddSSHKeys'
import { VolumeField } from '@/hooks/form/useAddVolume'
import {
  defaultInstanceImage,
  InstanceImageField,
} from '@/hooks/form/useSelectInstanceImage'
import {
  getDefaultSpecsOptions,
  InstanceSpecsField,
} from '@/hooks/form/useSelectInstanceSpecs'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { DomainField } from '@/hooks/form/useAddDomains'
import { AddInstance, InstanceManager } from '@/domain/instance'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import { useEntityCost } from '@/hooks/common/useEntityCost'
import { useRequestCRNs } from '@/hooks/common/useRequestEntity/useRequestCRNs'
import { useRequestCRNSpecs } from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { CRN, CRNSpecs, NodeLastVersions, NodeManager } from '@/domain/node'
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
import {
  BlockchainId,
  blockchains,
  defaultBlockchainProviders,
} from '@/domain/connect/base'
import { PaymentConfiguration } from '@/domain/executable'
import { EVMAccount } from '@aleph-sdk/evm'
import { isBlockchainHoldingCompatible } from '@/domain/blockchain'
import {
  ConnectionConfirmUpdateAction,
  ConnectionState,
} from '@/store/connection'
import {
  ModalCardProps,
  NotificationCardProps,
  useModal,
  useNotification,
} from '@aleph-front/core'
import {
  accountConnectionRequiredTooltipContent,
  insufficientBalanceTooltipContent,
  missingNodeTooltipContent,
  TooltipContent,
  unsupportedHoldingTooltipContent,
  unsupportedManualCRNSelectionTooltipContent,
  unsupportedStreamManualCRNSelectionTooltipContent,
  unsupportedStreamTooltipContent,
} from '@/components/pages/computing/NewInstancePage/tooltips'

export type NewInstanceFormState = NameAndTagsField & {
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
}

const defaultSpecs = {
  ...getDefaultSpecsOptions(true, PaymentMethod.Stream)[0],
}

export const defaultValues: Partial<NewInstanceFormState> = {
  ...defaultNameAndTags,
  image: defaultInstanceImage,
  specs: defaultSpecs,
  systemVolumeSize: defaultSpecs.storage,
  paymentMethod: PaymentMethod.Hold,
  streamDuration: defaultStreamDuration,
  streamCost: Number.POSITIVE_INFINITY,
}

export type Modal = 'node-list'

export type UseNewInstancePageReturn = {
  address: string
  accountBalance: number
  blockchainName: string
  manuallySelectCRNDisabled: boolean
  manuallySelectCRNTooltipContent?: TooltipContent
  createInstanceDisabled: boolean
  createInstanceTooltipContent?: TooltipContent
  streamDisabled: boolean
  disabledStreamTooltipContent?: TooltipContent
  values: any
  control: Control<any>
  errors: FieldErrors<NewInstanceFormState>
  node?: CRN
  lastVersion?: NodeLastVersions
  nodeSpecs?: CRNSpecs
  connectionAttempt: ConnectionState['connectionAttempt']
  selectedModal?: Modal
  setSelectedModal: (modal?: Modal) => void
  selectedNode?: string
  setSelectedNode: (hash?: string) => void
  modalOpen?: (info: ModalCardProps) => void
  modalClose?: () => void
  handleSubmit: (e: FormEvent) => Promise<void>
  handleCloseModal: () => void
  handleResetForm: (
    connectionAttempt: ConnectionState['connectionAttempt'],
  ) => void
  handleSwitchPaymentMethod: (method: PaymentMethod) => void
  handleManuallySelectCRN: () => void
  handleSwitchToNodeStream: () => Promise<void>
  handleBack: () => void
}

export function useNewInstancePage(): UseNewInstancePageReturn {
  const [, dispatch] = useAppState()
  const {
    blockchain,
    account,
    provider,
    balance: accountBalance = 0,
    connectionAttempt,
    handleConnect,
  } = useConnection({
    triggerOnMount: false,
  })
  const modal = useModal()
  const modalOpen = modal?.open
  const modalClose = modal?.close

  const notification = useNotification()
  const addNotification = notification?.add

  const router = useRouter()
  const { crn } = router.query

  const hasInitialized = useRef(false)
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.Hold)
  const [selectedNode, setSelectedNode] = useState<string>()
  const [selectedModal, setSelectedModal] = useState<Modal>()

  // -------------------------
  // Request CRNs specs

  const { nodes, lastVersion } = useRequestCRNs({})

  // @note: Set node depending on CRN
  const node = useMemo(() => {
    if (!nodes) return
    if (paymentMethod === PaymentMethod.Hold) return

    return nodes.find((node) => node.hash === crn)
  }, [crn, nodes, paymentMethod])

  const userNodes = useMemo(() => (node ? [node] : undefined), [node])
  const { specs } = useRequestCRNSpecs({ nodes: userNodes })

  const nodeSpecs = useMemo(() => {
    if (!node) return
    if (!specs) return

    return specs[node.hash]?.data
  }, [specs, node])

  // -------------------------
  // Checkout flow

  const manager = useInstanceManager()
  const { next, stop } = useCheckoutNotification({})
  const onSubmit = useCallback(
    async (state: NewInstanceFormState) => {
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

        const [minSpecs] = getDefaultSpecsOptions(true)
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

        await router.replace('/')
      } finally {
        await stop()
      }
    },
    [
      manager,
      account,
      node,
      blockchain,
      nodeSpecs,
      handleConnect,
      dispatch,
      router,
      next,
      stop,
    ],
  )

  // -------------------------
  // Setup form

  const accountSSHKeyItems = useAccountSSHKeyItems()
  const defaultFormValues: Partial<NewInstanceFormState> = useMemo(
    () => ({
      ...defaultValues,
      paymentMethod: paymentMethod || defaultValues.paymentMethod,
      sshKeys: accountSSHKeyItems,
    }),
    [paymentMethod, accountSSHKeyItems],
  )

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty: hasModifiedFormValues },
    setValue,
    reset: resetForm,
  } = useForm({
    defaultValues: defaultFormValues,
    onSubmit,
    resolver: zodResolver(
      !node ? InstanceManager.addSchema : InstanceManager.addStreamSchema,
    ),
    readyDeps: [defaultFormValues],
  })

  const formValues = useWatch({ control }) as NewInstanceFormState

  // -------------------------

  const { storage } = formValues.specs
  const { systemVolumeSize } = formValues
  const { cost } = useEntityCost({
    entityType: EntityType.Instance,
    props: {
      specs: formValues.specs,
      volumes: formValues.volumes,
      streamDuration: formValues.streamDuration,
      paymentMethod,
    },
  })

  // -------------------------
  // Memos

  const blockchainName = useMemo(() => {
    return blockchain ? blockchains[blockchain]?.name : 'current network'
  }, [blockchain])

  const disabledStreamTooltipContent: UseNewInstancePageReturn['disabledStreamTooltipContent'] =
    useMemo(() => {
      if (!account)
        return accountConnectionRequiredTooltipContent(
          'enable switching payment methods',
        )

      if (!isAccountPAYGCompatible(account))
        return unsupportedStreamTooltipContent(blockchainName)
    }, [account, blockchainName])

  const streamDisabled = useMemo(() => {
    return disabledStreamTooltipContent ? true : false
  }, [disabledStreamTooltipContent])

  const address = useMemo(() => account?.address || '', [account])

  const manuallySelectCRNTooltipContent: UseNewInstancePageReturn['manuallySelectCRNTooltipContent'] =
    useMemo(() => {
      if (!account)
        return accountConnectionRequiredTooltipContent(
          'manually selecting CRNs',
        )

      if (!isAccountPAYGCompatible(account))
        return unsupportedStreamManualCRNSelectionTooltipContent(blockchainName)

      if (paymentMethod === PaymentMethod.Hold)
        return unsupportedManualCRNSelectionTooltipContent()
    }, [account, blockchainName, paymentMethod])

  const manuallySelectCRNDisabled = useMemo(() => {
    return manuallySelectCRNTooltipContent ? true : false
  }, [manuallySelectCRNTooltipContent])

  const createInstanceTooltipContent: UseNewInstancePageReturn['createInstanceTooltipContent'] =
    useMemo(() => {
      if (!account)
        return accountConnectionRequiredTooltipContent(
          'enable Instance creation',
        )

      // Checks if user can afford with current balance
      if (
        process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE !== 'true' &&
        accountBalance < (cost?.totalCost || Number.MAX_SAFE_INTEGER)
      )
        return insufficientBalanceTooltipContent()

      // Checks configuration for PAYG tier
      if (paymentMethod === PaymentMethod.Stream) {
        if (!node) return missingNodeTooltipContent()
        if (!isBlockchainPAYGCompatible(blockchain))
          return unsupportedStreamTooltipContent(blockchainName)
      }

      // Checks configuration for Holder tier
      if (paymentMethod === PaymentMethod.Hold) {
        if (!isBlockchainHoldingCompatible(blockchain))
          return unsupportedHoldingTooltipContent(blockchainName)
      }
    }, [
      account,
      accountBalance,
      blockchain,
      blockchainName,
      cost,
      paymentMethod,
      node,
    ])

  const createInstanceDisabled = useMemo(() => {
    return createInstanceTooltipContent ? true : false
  }, [createInstanceTooltipContent])

  // -------------------------
  // Handlers

  const handleShowNotification = useCallback(
    (props: NotificationCardProps) => {
      addNotification && addNotification(props)
    },
    [addNotification],
  )

  const handleSelectNode = useCallback(
    async (hash?: string) => {
      if (!hash) return false

      const { crn, ...rest } = router.query
      if (crn === hash) return false

      return router.replace({ query: hash ? { ...rest, crn: hash } : rest })
    },
    [router],
  )

  const handleCloseModal = useCallback(() => {
    dispatch(
      new ConnectionConfirmUpdateAction({
        connectionAttempt: undefined,
      }),
    )
    setSelectedModal(undefined)
  }, [dispatch])

  const handleManuallySelectCRN = useCallback(() => {
    isBlockchainPAYGCompatible(blockchain)
      ? setSelectedModal('node-list')
      : handleShowNotification({
          variant: 'warning',
          title: `Manual CRN Selection Unavailable`,
          text: `Manual selection of CRN is not supported on ${blockchainName}.
           To access manual CRN selection, please switch to the Base or
           Avalanche chain using the dropdown at the top of the page.`,
        })
  }, [blockchain, blockchainName, handleShowNotification])

  const switchPaymentMethod = useCallback(
    (newPaymentMethod: PaymentMethod) => {
      setPaymentMethod(newPaymentMethod)
      setValue('paymentMethod', newPaymentMethod)
    },
    [setValue],
  )

  const handleSwitchToNodeStream = useCallback(async () => {
    if (!isBlockchainPAYGCompatible(blockchain))
      handleConnect({ blockchain: BlockchainId.BASE, provider })

    if (selectedNode !== node?.hash) handleSelectNode(selectedNode)

    setSelectedModal(undefined)
    switchPaymentMethod(PaymentMethod.Stream)
  }, [
    blockchain,
    provider,
    selectedNode,
    node?.hash,
    switchPaymentMethod,
    handleConnect,
    handleSelectNode,
  ])

  const handleSwitchToAutoHold = useCallback(() => {
    if (node?.hash) {
      setSelectedNode(undefined)
      handleSelectNode(undefined)
    }

    setSelectedModal(undefined)
    switchPaymentMethod(PaymentMethod.Hold)
  }, [node?.hash, switchPaymentMethod, handleSelectNode])

  const handleSwitchPaymentMethod = useCallback(
    (method: PaymentMethod) => {
      if (method === PaymentMethod.Stream) {
        isBlockchainPAYGCompatible(blockchain)
          ? handleSwitchToNodeStream()
          : handleShowNotification({
              variant: 'warning',
              title: 'Unsupported chain',
              text: `${blockchainName} does not support the Pay-As-You-Go tier payment method.
                     Change to the Base or Avalanche chain to enable it.`,
            })
      } else if (method === PaymentMethod.Hold) {
        isBlockchainHoldingCompatible(blockchain)
          ? handleSwitchToAutoHold()
          : handleShowNotification({
              variant: 'warning',
              title: 'Unsupported chain',
              text: `${blockchainName} does not support the Holder tier payment method`,
            })
      }
    },
    [
      blockchain,
      blockchainName,
      handleShowNotification,
      handleSwitchToAutoHold,
      handleSwitchToNodeStream,
    ],
  )

  const handleResetForm = useCallback(
    (connectionAttempt: ConnectionState['connectionAttempt']) => {
      resetForm(defaultFormValues)
      handleSwitchToAutoHold()
      handleCloseModal()
      if (connectionAttempt) dispatch(connectionAttempt)
    },
    [
      defaultFormValues,
      dispatch,
      handleCloseModal,
      handleSwitchToAutoHold,
      resetForm,
    ],
  )

  const handleBack = () => {
    router.push('.')
  }

  // -------------------------
  // Effects

  useEffect(() => {
    if (hasInitialized.current) return
    if (!router.isReady) return

    hasInitialized.current = true

    if (crn) {
      handleConnect({
        blockchain: BlockchainId.BASE,
        provider: defaultBlockchainProviders[BlockchainId.BASE],
      })
      switchPaymentMethod(PaymentMethod.Stream)
    }
  }, [router.isReady, crn, switchPaymentMethod, handleConnect])

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

  // // @note: Set payment method depending on wallet blockchain network
  // useEffect(() => {
  //   setValue('paymentMethod', !node ? PaymentMethod.Hold : PaymentMethod.Stream)
  // }, [node, setValue])

  // @note: Set streamCost
  useEffect(() => {
    if (!cost) return
    if (formValues.streamCost === cost.totalStreamCost) return

    setValue('streamCost', cost.totalStreamCost)
  }, [cost, setValue, formValues])

  // Manage connection confirmation modal
  useEffect(() => {
    function disableConnectionConfirmationModal() {
      dispatch(
        new ConnectionConfirmUpdateAction({
          needsConfirmation: false,
          connectionAttempt: undefined,
        }),
      )
    }

    function enableConnectionConfirmationModal() {
      dispatch(new ConnectionConfirmUpdateAction({ needsConfirmation: true }))
    }

    if (node) return enableConnectionConfirmationModal()

    if (!address) return disableConnectionConfirmationModal()
    if (!hasModifiedFormValues) return disableConnectionConfirmationModal()

    enableConnectionConfirmationModal()

    return () => disableConnectionConfirmationModal()
  }, [address, hasModifiedFormValues, node, dispatch])

  return {
    address,
    accountBalance,
    blockchainName,
    createInstanceDisabled,
    createInstanceTooltipContent,
    manuallySelectCRNDisabled,
    manuallySelectCRNTooltipContent,
    values: formValues,
    control,
    errors,
    node,
    lastVersion,
    nodeSpecs,
    streamDisabled,
    disabledStreamTooltipContent,
    connectionAttempt,
    selectedModal,
    setSelectedModal,
    selectedNode,
    setSelectedNode,
    modalOpen,
    modalClose,
    handleSubmit,
    handleCloseModal,
    handleResetForm,
    handleSwitchPaymentMethod,
    handleManuallySelectCRN,
    handleSwitchToNodeStream,
    handleBack,
  }
}
