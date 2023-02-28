import { Account } from "aleph-sdk-ts/dist/accounts/account";
import { GetAccountFromProvider as getETHAccount } from "aleph-sdk-ts/dist/accounts/ethereum";
import { GetAccountFromProvider as getSOLAccount } from "aleph-sdk-ts/dist/accounts/solana";

type Chains = "ethereum" | "solana";

export const web3Connect = (chain: Chains, provider: any): Promise<Account> => {
  switch (chain) {
    case "ethereum":
      return getETHAccount(provider);

    case "solana":
      return getSOLAccount(provider);

    default:
      throw new Error("Invalid chain");
  }
};
