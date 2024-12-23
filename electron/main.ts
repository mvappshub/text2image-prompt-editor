import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'

// Oprava cest pro produkční build
const isPackaged = app.isPackaged
const DIST = isPackaged ? path.join(process.resourcesPath, 'app.asar') : path.join(__dirname, '..')
const VITE_PUBLIC = isPackaged ? process.resourcesPath : path.join(DIST, 'public')

// Nastavení cest pro aplikaci
process.env.DIST = DIST
process.env.VITE_PUBLIC = VITE_PUBLIC
process.env.PUBLIC = VITE_PUBLIC

let win: BrowserWindow | null = null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Text2Image Prompt Editor',
    icon: path.join(VITE_PUBLIC, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    },
  })

  // Zakázat menu v produkci
  if (isPackaged) {
    win.setMenu(null)
  }

  // Nastavení content security policy
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self' 'unsafe-inline' 'unsafe-eval'"]
      }
    })
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // Oprava cesty k index.html pro produkční build
    const indexHtml = isPackaged
      ? path.join(DIST, 'index.html')
      : path.join(DIST, 'dist', 'index.html')
    win.loadFile(indexHtml)
  }
}

// Správa životního cyklu aplikace
app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// Inicializace aplikace
app.whenReady().then(() => {
  createWindow()
})
