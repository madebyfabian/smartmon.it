export default () => new Promise(( resolve, reject ) => {
  // Connect to WebSocket
  const ws = new WebSocket("ws://localhost:4444")

  ws.onopen = e => {
    console.log("[ws] Connection to ws server established!")
    resolve(ws)
  }

  ws.onerror = e => {
    console.error('[ws]', e)
    reject(e)
  }
})