// WebSocket Stuff
import initWebSocket from './electron/initWebSocket'

// Electron Stuff
import { app, protocol, BrowserWindow, screen } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { getOhmData, stopOhmService, startOhmService } from './electron/ohmUtils'
import path from 'path'

// Logger
import log from 'electron-log'

const isDevelopment = process.env.NODE_ENV !== 'production'


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])


const createWindow = () => {
  // Create the browser window.
  let display = screen.getPrimaryDisplay(),
      width = 328 + 32,
      height = 448 + 32,
      x = display.bounds.width - width,
      y = display.bounds.height - height - 40 // Task bar
      
  
  win = new BrowserWindow({
    width: width,
    height: height,
    x,
    y,
    transparent: true, 
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    fullscreenable: false,
    maximizable: false,
    resizable: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    icon: path.join(__static, 'icon.png')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL) // Load the url of the dev server if in development mode
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html') // Load the index.html when not in development
  }

  win.on('closed', () => {
    win = null
  })
}


// Quit when all windows are closed.
app.on('window-all-closed', async () => {
  // Stop the OpenHardwareMonitor Windows Service.
  await stopOhmService()

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') 
    app.quit()
})


app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) 
    createWindow()
})


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS)
  //   } catch (e) { console.error('Vue Devtools failed to install:', e.toString()) }
  // }

  // Create electron window.
  createWindow()
  
  // Init WebSocket Server
  const ws = await initWebSocket()

  ws.on('message', function incoming(data) {
    switch (data) {
      case 'CLOSE_WINDOW':
        win.close()
        break;

      case 'MINIMIZE_WINDOW':
        win.minimize()
        break
    }
  });

  // Start OpenHardwareMonitor Windows Service.
  await startOhmService()

  // Create Function the the OHM Data to get sent by WebSocket
  const sendData = async () => {
    let ohmData = await getOhmData()
    ws.send(JSON.stringify(ohmData))
    // console.log('[ws] Data sent.')
  }

  // Get the OHM Data for the first time. This can take up to 20 seconds!
  await sendData()

  // Now, after the data is available for the first time, set an 1s-interval :)
  setInterval(sendData, 1000)
})


process.on('warning', e => console.warn(e.stack));


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
