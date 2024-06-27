import { Future } from './utils'

export async function* subscribeSocketFeed<T>(
  url: string,
  abort: Promise<void>,
): AsyncGenerator<T> {
  let socket: WebSocket | undefined

  // console.log('__ SOCKET')

  const values: T[] = []
  const futures: Future<T>[] = []

  abort.then(clear)

  function clear() {
    while (values.length) {
      values.pop()
    }

    while (futures.length) {
      const future = futures.shift()
      future?.reject()
    }
  }

  function deliver() {
    while (true) {
      if (values.length === 0 || futures.length === 0) return

      const nextValue = values.shift() as T
      const nextFuture = futures.shift() as Future<T>

      nextFuture?.resolve(nextValue)
    }
  }

  const connect = async () => {
    const ws = new WebSocket(url)
    socket = ws

    const future = new Future<void>()

    // console.log('__ CONNECT')

    ws.addEventListener('message', handleMessage)
    ws.addEventListener('close', handleClose)
    ws.addEventListener('error', handleError)
    ws.addEventListener('open', () => {
      future.resolve()
    })

    // console.log('Oppening Socket', ws.readyState)
    return future.promise
  }

  const close = (e?: CloseEvent, reconnect = true) => {
    if (!socket) return
    const ws = socket

    ws.removeEventListener('message', handleMessage)
    ws.removeEventListener('close', handleClose)
    ws.removeEventListener('error', handleError)

    function defferClose() {
      // console.log('__ CLOSE')

      ws.close()
      ws.removeEventListener('open', defferClose)

      if (reconnect) {
        // console.log('Reconnecting Socket in 1 second')
        setTimeout(connect, 1000)
      }
    }

    socket = undefined
    // console.log('Closing Socket', e?.reason, ws.readyState)

    if (ws.readyState === 1) {
      defferClose()
    } else {
      ws.addEventListener('open', defferClose)
    }
  }

  const push = (value: T) => {
    values.push(value)
    deliver()
  }

  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data)
    push(data)
  }

  const handleClose = (e: CloseEvent) => {
    close(e, true)
  }

  const handleError = (err: any) => {
    console.error('Socket encountered error: ', err?.message, 'Closing socket')
    close(undefined, false)
  }

  await connect()

  try {
    yield socket as any

    while (true) {
      const future = new Future<T>()
      futures.push(future)

      deliver()

      yield await future.promise
    }
  } finally {
    // @note. close socket on abort (useEffect Destructor)

    close(undefined, false)
  }
}
