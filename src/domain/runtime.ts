export enum FunctionRuntimeId {
  Runtime1 = 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4',
  // @note: Added trailing blank spaces for generating different unique ids (it will be safely .trim() before sending the request) until the right hashes are provided
  Runtime2 = 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4 ',
  Custom = 'custom',
}

export type FunctionRuntime = {
  id: string
  name: string
  dist: string
  meta?: string
}

export const FunctionRuntimes: Record<FunctionRuntimeId, FunctionRuntime> = {
  [FunctionRuntimeId.Runtime1]: {
    id: FunctionRuntimeId.Runtime1,
    name: 'Official runtime with Debian 11, Python 3.9 & Node.js 14',
    dist: 'debian',
  },
  [FunctionRuntimeId.Runtime2]: {
    id: FunctionRuntimeId.Runtime2,
    name: 'Official min. runtime for binaries x86_64 (Rust, Go, ...)',
    dist: 'debian',
  },
  [FunctionRuntimeId.Custom]: {
    id: FunctionRuntimeId.Custom,
    name: 'Custom runtime',
    dist: 'ubuntu',
  },
}
