import { Account } from "aleph-sdk-ts/dist/accounts/account";

export enum ActionTypes {
  connect,
  disconnect,
  getAccountBalance,
}

export type State = {
  account?: Account;
  account_meta: {
    balance?: number;
  };
};

export type Action = {
  type: ActionTypes;
  payload: any;
};

export const initialState: State = {
  account: undefined,
  account_meta: {
    balance: undefined,
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

    case ActionTypes.getAccountBalance:
      return {
        ...state,
        account_meta: {
          ...state.account_meta,
          balance: payload.balance,
        },
      };

    default:
      return state;
  }
};
