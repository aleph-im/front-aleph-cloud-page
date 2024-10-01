// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ChainNotYetSupported: new Error('Chain is not yet supported'),
  BlockchainNotSupported: (chainId: number | string) =>
    new Error(`Blockchain "${chainId}" not supported on this provider`),
  RequestTimeout: new Error('Request timed out'),
  RequestFailed: (cause: unknown) => new Error('Request failed', { cause }),
  InvalidResponse: new Error('Invalid response'),
  InvalidAccount: new Error('Account needed to perform this action'),
  ManagerNotReady: new Error('Manager not ready'),
  MethodNotImplemented: new Error('Method not implemented'),
  NoWalletDetected: new Error('No wallet detected'),
  MetamaskNotInstalled: new Error('WalletConnect not installed'),
  WalletConnectNotInitialized: new Error('WalletConnect not initialized'),
  ConnectYourWallet: new Error('Please connect your wallet'),
  ConnectYourPaymentWallet: new Error(
    'Please connect your Superfluid Base/Avalanche wallet',
  ),
  UserCancelled: new Error('User cancelled the action'),
  InvalidNetwork: new Error('Invalid network'),
  InstanceNotFound: new Error('Instance not found'),
  ConfidentialNotFound: new Error('Confidential not found'),
  FunctionNotFound: new Error('Function not found'),
  WebsiteNotFound: new Error('Website not found'),
  VolumeNotFound: new Error('Volume not found'),
  SSHKeyNotFound: new Error('SSH key not found'),
  DomainNotFound: new Error('Domain not found'),
  InvalidStreamCost: new Error('Invalid stream cost'),
  InvalidNode: new Error('Invalid node'),
  UnknownType: new Error('Unknown type'),
  ValidationError: new Error('Validation error, check highlighted form fields'),
  FieldError: (field: string, description?: string) =>
    new Error(`Error on field "${field}": ${description}`),
  NotificationsNotReady: new Error('Notifications not ready'),
  InvalidCodeFile: new Error('Invalid function code file'),
  InvalidCodeType: new Error('Invalid function code type'),
  InvalidCRNAddress: new Error('Invalid CRN address'),
  InvalidCRNSpecs: new Error('Invalid CRN min specs'),
  InvalidConfidentialNodeRequirements: new Error(
    'Invalid Confidential VM Node Requirements',
  ),
  CustomRuntimeNeeded: new Error('Custom runtime should be added'),
  ReceivedRequired: new Error(
    'Payment receiver is required for stream payments',
  ),
  ReceiverReward: new Error(
    'Invalid Superfluid ETH/AVAX receiver reward address. Please set it up in your CRN account profile',
  ),
  StreamNotSupported: new Error(
    'Stream payments are only supported on Avalanche or Base',
  ),
  MaxFlowRate: new Error(
    `Current maximum total flow rate of 1 ALEPH/hour exceeded. Delete other instances or lower the VM cost`,
  ),
  InsufficientBalance: (needed_balance: number) =>
    new Error(
      `Insufficient balance: ${needed_balance.toString()} ALEPH required. Try to lower the VM cost or the duration`,
    ),
  DomainUsed: (domain: string) =>
    new Error(`Domain name already used by another resource: ${domain}`),
  SSHKeysUsed: (sshKey: string) =>
    new Error(`SSH key already used by another resource: ${sshKey}`),
  InstanceStartupFailed: (id: string, error: string) =>
    new Error(`Failed to start instance on CRN ${id}: ${error}`),
  MissingVolumeData: new Error('Missing volume data'),
}
