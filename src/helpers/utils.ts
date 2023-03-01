import { providers, Contract } from "ethers";
import * as SOLUtils from "@solana/web3.js";
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
  const connection = new SOLUtils.Connection(
    "https://api.mainnet-beta.solana.com",
    "confirmed"
  );
  const mint = new SOLUtils.PublicKey(
    "3UCMiSnkcnkPE1pgQ5ggPCBv6dXgVUy16TmMUe1WpG9x"
  );
  const account = new SOLUtils.PublicKey(address);

  try {
    const query = await connection.getTokenAccountsByOwner(account, { mint });
    if (query.value.length === 0) {
      return 0;
    }
    const b = query.value[0].account.data.toJSON();
    return b.parsed.info.tokenAmount.uiAmount;
  } catch (error) {
    throw E_.RequestFailed(error);
  }
};

export const msgIsFunction = (msg: ProgramMessage) => {
  return msg.content.on?.persistent === true;
};
