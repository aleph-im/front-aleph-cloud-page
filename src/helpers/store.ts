import { Account } from "aleph-sdk-ts/dist/accounts/account";
import { ProgramMessage } from "aleph-sdk-ts/dist/messages/message";

export enum ActionTypes {
  connect,
  disconnect,
  setAccountBalance,
  setProducts,
}

export type State = {
  account?: Account;
  account_balance?: number;
  products: {
    databases?: ProgramMessage[];
    instances?: ProgramMessage[];
    functions?: ProgramMessage[];
  };
};

export type Action = {
  type: ActionTypes;
  payload: any;
};

export const initialState: State = {
  account: undefined,
  account_balance: undefined,
  products: {
    databases: undefined,
    instances: undefined,
    functions: undefined,
  },
};

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case ActionTypes.connect:
      return {
        ...state,
        account: payload.account,
      };

    case ActionTypes.disconnect:
      return {
        ...state,
        account: undefined,
      };

    case ActionTypes.setAccountBalance:
      return {
        ...state,
        account_balance: payload.balance,
      };

    case ActionTypes.setProducts:
      return {
        ...state,
        products: payload.products,
      };

    default:
      return state;
  }
};
