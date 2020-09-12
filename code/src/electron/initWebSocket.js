import WebSocket from 'ws'


export default () => new Promise(( resolve, reject ) => {
  const wsServer = new WebSocket.Server({ port: 4444 })

  wsServer.on('connection', ws => {
    console.log('[ws] Successfully connected.')
    resolve(ws)
  })
})