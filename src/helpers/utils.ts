import { providers, Contract } from "ethers";
import E_ from "./errors";
import { ProgramMessage } from "aleph-sdk-ts/dist/messages/message";

/**
 * Takes a string and returns a shortened version of it, with the first 6 and last 4 characters separated by '...'
 *
 * @param address An address to be shortened
 * @returns A shortened address
 */
export const ellipseAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Checks if a string is a valid Aleph message item hash
 */
export const isValidItemHash = (hash: string) => {
  const regex = /^[0-9a-f]{64}$/;
  return regex.test(hash);
};

export type EnvironmentVariable = {
  name: string;
  value: string;
};
/**
 * Takes a collection of environment variables and returns an object with the name and value of each variable.
 */
export const safeCollectionToObject = (collection: EnvironmentVariable[]) => {
  const ret: Record<string, string> = {};
  for (const { name, value } of collection) {
    if (name.trim().length > 0 && value.trim().length > 0) {
      ret[name] = value;
    }
  }

  return ret;
};

/**
 * Get the Aleph balance for a given Ethereum address
 *
 * @param address An Ethereum address
 * returns The Aleph balance of the address
 */
export const getERC20Balance = async (address: string) => {
  // FIXME: This is a temporary solution, we should not rely on Infura
  const provider = new providers.InfuraProvider(
    "homestead",
    "4890a5bd89854916b128088119d76b50"
  );

  const ERC20_ABI = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",

    // Authenticated Functions
    "function transfer(address to, uint amount) returns (boolean)",

    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];

  const ERC20_CONTRACT_ADDRESS = "0x27702a26126e0B3702af63Ee09aC4d1A084EF628";

  const ERC20Contract = new Contract(
    ERC20_CONTRACT_ADDRESS,
    ERC20_ABI,
    provider
  );

  try {
    const rawBalance = await ERC20Contract.balanceOf(address);
    const decimals = await ERC20Contract.decimals();
    const balance = rawBalance / 10 ** decimals;
    return balance;
  } catch (error) {
    throw E_.RequestFailed(error);
  }
};

/**
 * Gets the Aleph balance for a given Solana address
 *
 * @param address A Solana address
 * @returns The Aleph balance of the address
 */
export const getSOLBalance = async (address: string) => {
  // FIXME: This is a temporary solution
  try {
    const query = await fetch(
      `https://balance1.api.aleph.cloud/solana/${address}`
    );

    const { balance } = await query.json();
    return balance;
  } catch (error) {
    throw E_.RequestFailed(error);
  }
};

type BitUnit = "kb" | "mb" | "gb" | "tb";
type ConvertBitUnitOptions = {
  from: BitUnit;
  to: BitUnit;
  displayUnit: boolean;
};
export const convertBitUnits = (
  value: number,
  { from = "mb", to = "gb", displayUnit = true }: Partial<ConvertBitUnitOptions>
) => {
  const options: ConvertBitUnitOptions = { from, to, displayUnit };
  const units = {
    kb: 1024,
    mb: 1024 ** 2,
    gb: 1024 ** 3,
    tb: 1024 ** 4,
  };

  const result = (value * units[options.from]) / units[options.to];
  return options.displayUnit ? `${result} ${options.to.toUpperCase()}` : result;
};

/**
 * Returns a short cryptographically secure hexadecimal random ID
 */
export const uniqId = () =>
  crypto.getRandomValues(new Uint32Array(1))[0].toString(16);

/**
 * Returns a link to the Aleph explorer for a given message
 */
export const getExplorerURL = ({ item_hash, chain, sender }: ProgramMessage) =>
  `https://explorer.aleph.im/address/${chain}/${sender}/message/PROGRAM/${item_hash}`;

/**
 * Converts a UNIX timestamp to an ISO date, or returns a default value if the timestamp is invalid
 *
 * @param timeStamp A UNIX timestamp
 * @param noDate A default value to return if the timestamp is invalid
 */
export const unixToISODateString = (
  timeStamp?: number,
  noDate: string = "n/a"
) => {
  if (!timeStamp) return noDate;
  const date = new Date(timeStamp * 1000);
  return date.toISOString().split("T")[0];
};

/**
 * Converts a UNIX timestamp to an ISO date and time, or returns a default value if the timestamp is invalid
 *
 * @param timeStamp A UNIX timestamp
 * @param noDate A default value to return if the timestamp is invalid
 */
export const unixToISODateTimeString = (
  timeStamp?: number,
  noDate: string = "n/a"
) => {
  if (!timeStamp) return noDate;
  const date = new Date(timeStamp * 1000);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZoneName: "short",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
};

type MachineSpecs = {
  cpu: number;
  memory: number;
  storage: number;
};
export const getFunctionSpecsByComputeUnits = (
  computeUnits: number,
  isPersistent: boolean
): MachineSpecs => {
  return {
    cpu: 1 * computeUnits,
    memory: 2 * computeUnits * 1024,
    storage: 2 * 10 ** Number(isPersistent) * computeUnits * 1024,
  };
};

type CapabilitiesConfig = {
  internetAccess?: boolean;
  blockchainRPC?: boolean;
  enableSnapshots?: boolean;
};
type FunctionPriceConfig = {
  computeUnits: number;
  storage: number;
  isPersistent: boolean;
  capabilities: CapabilitiesConfig;
};
/**
 * Calculates the amount of tokens required to deploy a function
 */
export const getFunctionCost = ({
  computeUnits,
  storage,
  isPersistent,
  capabilities,
}: FunctionPriceConfig) => {
  let extraStorageCost = 0;
  const storageAllowance = getFunctionSpecsByComputeUnits(
    computeUnits,
    isPersistent
  ).storage;

  if (storage > storageAllowance) {
    extraStorageCost = (storage - storageAllowance) * 3;
  }

  const basePrice = isPersistent ? 2_000 : 200;

  return {
    compute: basePrice * computeUnits,
    capabilities: Object.values(capabilities).reduce(
      (ac, cv) => (ac += cv ? 1 : 0),
      1
    ),
    storage: extraStorageCost,
  };
};
