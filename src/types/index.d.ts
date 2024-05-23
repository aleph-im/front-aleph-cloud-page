export {}

declare global {
  interface Window {
    ethereum: import('ethers').providers.ExternalProvider
    //helia: import('@helia/interface').Helia | undefined
  }
}

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string
    webkitdirectory?: string
  }
}
