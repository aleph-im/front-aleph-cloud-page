import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
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
import { BlockchainId, blockchains } from '@/domain/connect/base'
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

export type TooltipContent = {
  title: string
  description: string
}

export type UseNewInstancePageReturn = {
  address: string
  accountBalance: number
  blockchainName: string
  manuallySelectCRNDisabled: boolean
  manuallySelectCRNTooltipContent?: TooltipContent
  createInstanceDisabled: boolean
  createInstanceTooltipContent?: TooltipContent
  values: any
  control: Control<any>
  errors: FieldErrors<NewInstanceFormState>
  node?: CRN
  lastVersion?: NodeLastVersions
  nodeSpecs?: CRNSpecs
  disabledPAYG: boolean
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
  const router = useRouter()
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

  const [node, setNode] = useState<CRN | undefined>()
  const [selectedNode, setSelectedNode] = useState<string>()
  const [selectedModal, setSelectedModal] = useState<Modal>()

  // -------------------------
  // Request CRNs specs

  const userNodes = useMemo(() => (node ? [node] : undefined), [node])

  const { nodes, lastVersion } = useRequestCRNs({})
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
        node,
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

  const { crn } = router.query
  const accountSSHKeyItems = useAccountSSHKeyItems()
  const defaultFormValues: Partial<NewInstanceFormState> = useMemo(
    () => ({
      ...defaultValues,
      // paymentMethod: crn ? PaymentMethod.Stream : PaymentMethod.Hold,
      sshKeys: accountSSHKeyItems,
    }),
    [accountSSHKeyItems],
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
      paymentMethod: formValues.paymentMethod,
      streamDuration: formValues.streamDuration,
    },
  })

  // -------------------------
  // Memos

  const blockchainName = useMemo(() => {
    return blockchain ? blockchains[blockchain]?.name : 'current network'
  }, [blockchain])

  const disabledPAYG = useMemo(() => {
    return !isAccountPAYGCompatible(account)
  }, [account])

  const address = useMemo(() => account?.address || '', [account])

  const manuallySelectCRNTooltipContent: TooltipContent | undefined =
    useMemo(() => {
      if (!account)
        return {
          title: 'Account Connection Required',
          description: `Please connect your account to enable switching payment methods.
        Connect your wallet using the top-right button to access all features.`,
        }

      if (!isAccountPAYGCompatible(account))
        return {
          title: 'Manual CRN Selection Unavailable',
          description: `Manual selection of CRN is not supported on ${blockchainName}.
        To access manual CRN selection, please switch to the Base or Avalanche chain
        using the dropdown at the top of the page.`,
        }

      if (formValues.paymentMethod === PaymentMethod.Hold) {
        return {
          title: 'Feature Unavailable in Holder Tier',
          description: `Manual CRN selection is disabled in the Holder tier.
        Switch to the Pay-As-You-Go tier to enable manual selection of CRNs.`,
        }
      }
    }, [account, blockchainName, formValues.paymentMethod])

  const manuallySelectCRNDisabled = useMemo(() => {
    return manuallySelectCRNTooltipContent ? true : false
  }, [manuallySelectCRNTooltipContent])

  const createInstanceTooltipContent: TooltipContent | undefined =
    useMemo(() => {
      if (!account)
        return {
          title: 'Account Connection Required',
          description: `Please connect your account to enable Instance creation.
         Connect your wallet using the top-right button to access all features.`,
        }

      // Checks if user can afford with current balance
      if (
        process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE !== 'true' &&
        accountBalance < (cost?.totalCost || Number.MAX_SAFE_INTEGER)
      ) {
        return {
          title: 'Insufficient balance',
          description: `Please add funds to your account to create an instance
         with the current configuration.`,
        }
      }

      // Checks configuration for PAYG tier
      if (formValues.paymentMethod === PaymentMethod.Stream) {
        if (!node)
          return {
            title: 'Invalid configuration',
            description: `Please select a CRN to enable Instance creation.
           Select a CRN using the "Manually select CRN" button on the form.`,
          }
        if (!isBlockchainPAYGCompatible(blockchain))
          return {
            title: 'Payment Method not supported',
            description: `Pay-As-You-Go payment method is not supported on ${blockchainName}.`,
          }
      }

      // Checks configuration for Holder tier
      if (formValues.paymentMethod === PaymentMethod.Hold) {
        if (!isBlockchainHoldingCompatible(blockchain))
          return {
            title: 'Payment Method not supported',
            description: `Holder tier payment method is not supported on ${blockchainName}.`,
          }
      }
    }, [
      account,
      accountBalance,
      blockchain,
      blockchainName,
      cost,
      formValues.paymentMethod,
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
      const { crn, ...rest } = router.query
      const query = hash ? { ...rest, crn: hash } : rest

      if (crn === query.crn) return false

      return router.replace({ query })
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

  const handleSwitchToNodeStream = useCallback(async () => {
    if (!isBlockchainPAYGCompatible(blockchain))
      handleConnect({ blockchain: BlockchainId.BASE, provider })

    if (selectedNode !== node?.hash) handleSelectNode(selectedNode)

    setSelectedModal(undefined)
    setValue('paymentMethod', PaymentMethod.Stream)
  }, [
    blockchain,
    handleConnect,
    provider,
    selectedNode,
    node?.hash,
    handleSelectNode,
    setValue,
  ])

  const handleSwitchToAutoHold = useCallback(() => {
    if (node?.hash) {
      setSelectedNode(undefined)
      handleSelectNode(undefined)
    }

    setSelectedModal(undefined)
    setValue('paymentMethod', PaymentMethod.Hold)
  }, [handleSelectNode, node?.hash, setValue])

  const handleSwitchPaymentMethod = useCallback(
    (method: PaymentMethod) => {
      if (method === PaymentMethod.Stream) {
        isBlockchainPAYGCompatible(blockchain)
          ? handleSwitchToNodeStream()
          : handleShowNotification({
              variant: 'warning',
              title: 'Unsupported chain',
              text: `${blockchainName} does not support the Pay-As-You-Go tier payment method`,
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

  // @note: Set node depending on CRN
  useEffect(() => {
    if (!nodes) return setNode(undefined)
    if (formValues.paymentMethod === PaymentMethod.Hold)
      return setNode(undefined)

    setNode(nodes.find((node) => node.hash === crn))
  }, [crn, nodes, formValues.paymentMethod])

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
    disabledPAYG,
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
