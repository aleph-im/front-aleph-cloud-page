/* eslint-disable react-hooks/exhaustive-deps */
import { Helia, createHelia } from 'helia'
import { unixfs, UnixFS } from '@helia/unixfs'
import {
  useEffect,
  useState,
  useCallback,
  useContext,
  createContext,
  PropsWithChildren,
} from 'react'
import { getP2PNode } from '@/helpers/ipfs'
import type { CID } from 'multiformats/cid'

type CoreType = {
  helia: null | Helia
  unixfs: null | UnixFS
  addFolder: null | ((folder: FileList) => Promise<{ v0: string; v1: string }>)
}

const emptyCore: CoreType = {
  helia: null,
  unixfs: null,
  addFolder: null,
}

export type HeliaContextType = CoreType & {
  starting: boolean
  error: null | boolean
}

export const HeliaContext = createContext<HeliaContextType>({
  ...emptyCore,
  starting: true,
  error: false,
})

interface FileNode {
  file: string | File
  children: FileNode[]
}

function createFileTree(files: FileList): FileNode {
  const root: FileNode = { file: '', children: [] }
  Array.from(files).forEach((file) => {
    const parts = file.webkitRelativePath.split('/')
    let currentNode = root
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        currentNode.children?.push({ file: file, children: [] })
      } else {
        let existingNode = currentNode.children?.find(
          (node) => node.file === part,
        )
        if (!existingNode) {
          existingNode = { file: part, children: [] }
          currentNode.children?.push(existingNode)
        }
        currentNode = existingNode
      }
    })
  })
  return root.children[0]
}

const buildAddFolder = function (helia: Helia, fs: UnixFS) {
  const addFolder = async function (
    folder: FileList,
  ): Promise<{ v0: string; v1: string }> {
    const fileTree = createFileTree(folder)
    const addDir = async function (tree: FileNode): Promise<CID> {
      let rootCid = await fs.addDirectory()
      await Promise.all(
        tree.children.map(async (item) => {
          const cid =
            item.file instanceof File
              ? await fs.addFile({
                  content: new Uint8Array(await item.file.arrayBuffer()),
                })
              : await addDir(item)
          rootCid = await fs.cp(
            cid,
            rootCid,
            item.file instanceof File ? item.file.name : item.file,
          )
        }),
      )
      return rootCid
    }
    const folderCid = await addDir(fileTree)
    try {
      await helia.pins.add(folderCid)
      console.log('isPinned? ', await helia.pins.isPinned(folderCid))
    } catch (e) {
      console.log('isPinned? Already pinned')
    }
    return { v0: folderCid.toV0().toString(), v1: folderCid.toV1().toString() }
  }
  return addFolder
}

export const HeliaProvider = ({ children }: PropsWithChildren<object>) => {
  const [core, setCore] = useState<CoreType>(emptyCore)
  const [starting, setStarting] = useState<boolean>(true)
  const [error, setError] = useState<null | boolean>(null)

  const startHelia = useCallback(async () => {
    if (core.helia) {
      console.info('Helia: Already started')
    } else if (window.helia) {
      console.info('Helia: Reusing window.helia')
      const helia = window.helia as unknown as Helia
      const fs = unixfs(helia)
      setCore({ helia, unixfs: fs, addFolder: buildAddFolder(helia, fs) })
    } else {
      try {
        const libp2p = await getP2PNode()
        console.info('Helia: Starting')
        const helia = await createHelia({ libp2p })
        const fs = unixfs(helia)
        setCore({ helia, unixfs: fs, addFolder: buildAddFolder(helia, fs) })
      } catch (e) {
        console.error('Helia: Failed to start\n', e)
        setError(true)
      }
    }
    setStarting(false)
  }, [])

  useEffect(() => {
    if (starting) startHelia()
  }, [])

  return (
    <HeliaContext.Provider
      value={{
        ...core,
        starting,
        error,
      }}
    >
      {children}
    </HeliaContext.Provider>
  )
}

export function useIPFS(): HeliaContextType {
  return useContext(HeliaContext)
}
