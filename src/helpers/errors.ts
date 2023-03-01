export default {
  ChainNotYetSupported: new Error("Chain is not yet supported"),
  RequestTimeout: new Error("Request timed out"),
  RequestFailed: (cause: any) => new Error("Request failed", { cause }),
};
