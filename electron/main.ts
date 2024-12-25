import { app, BrowserWindow, dialog, Menu, MenuItemConstructorOptions, WebContents, Event } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'

let mainWindow: BrowserWindow | null = null

function getAssetPath(...paths: string[]): string {
  if (app.isPackaged) {
    return join(process.resourcesPath, ...paths)
  }
  return join(__dirname, '..', ...paths)
}

// Oprava cest pro produkční build
const isPackaged = app.isPackaged
const DIST = join(__dirname, '..')
const DIST_WEB = join(DIST, 'dist-web')  // Přidáno pro správnou cestu k web souborům
const VITE_PUBLIC = join(app.getPath('exe'), isPackaged ? '.' : '../public')

// Nastavení cest pro aplikaci
process.env.DIST = DIST
process.env.DIST_WEB = DIST_WEB  // Přidáno pro správnou cestu k web souborům
process.env.VITE_PUBLIC = VITE_PUBLIC
process.env.PUBLIC = VITE_PUBLIC

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createMenu(): void {
  const template: MenuItemConstructorOptions[] = [
    {
      label: '&File',
      submenu: [
        {
          label: 'E&xit',
          accelerator: 'Alt+F4',
          click: () => app.quit()
        }
      ]
    },
    {
      label: '&View',
      submenu: [
        {
          label: 'Zoom &In',
          accelerator: 'CommandOrControl+Plus',
          click: () => {
            if (mainWindow) {
              const currentZoom = mainWindow.webContents.getZoomLevel()
              mainWindow.webContents.setZoomLevel(Math.min(currentZoom + 0.5, 3))
            }
          }
        },
        {
          label: 'Zoom &Out',
          accelerator: 'CommandOrControl+-',
          click: () => {
            if (mainWindow) {
              const currentZoom = mainWindow.webContents.getZoomLevel()
              mainWindow.webContents.setZoomLevel(Math.max(currentZoom - 0.5, -3))
            }
          }
        },
        {
          label: '&Reset Zoom',
          accelerator: 'CommandOrControl+0',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.setZoomLevel(0)
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Toggle &Full Screen',
          accelerator: 'F11',
          click: () => {
            if (mainWindow) {
              mainWindow.setFullScreen(!mainWindow.isFullScreen())
            }
          }
        },
        {
          label: 'Toggle &Developer Tools',
          accelerator: 'F12',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools()
            }
          }
        }
      ]
    },
    {
      label: '&Help',
      submenu: [
        {
          label: '&About',
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              title: 'About Text2Image Prompt Editor',
              message: 'Text2Image Prompt Editor v1.0.0\nCreated by Martin Vosáhlo',
              buttons: ['OK']
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Text2Image Prompt Editor',
    icon: getAssetPath('icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      preload: join(__dirname, 'preload.js')
    },
  })

  // Zakázat menu v produkci
  if (isPackaged) {
    // mainWindow.setMenu(null)
    createMenu()
  } else {
    createMenu()
  }

  const indexPath = isPackaged
    ? join(__dirname, '..', 'dist-web', 'index.html')
    : join(__dirname, '..', 'dist-web', 'index.html')

  // Test existence souboru
  console.log('Index path:', indexPath)
  console.log('Index exists:', existsSync(indexPath))
  console.log('Current directory:', __dirname)
  console.log('Resource path:', process.resourcesPath)

  // Nastavení content security policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details: Electron.OnHeadersReceivedListenerDetails, callback: (response: Electron.HeadersReceivedResponse) => void) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self' 'unsafe-inline' 'unsafe-eval'"]
      }
    })
  })

  // Přidání error handleru
  mainWindow.webContents.on('render-process-gone', (_event: Event, details: Electron.RenderProcessGoneDetails) => {
    console.error('Renderer process gone:', details.reason)
    dialog.showErrorBox('Application Error', 'The application encountered an error and needs to restart.')
    app.relaunch()
    app.exit(0)
  })

  mainWindow.webContents.on('did-finish-load', () => {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('main-process-message', (new Date).toLocaleString())
    }
  })

  if (VITE_DEV_SERVER_URL) {
    console.log('Loading dev server URL:', VITE_DEV_SERVER_URL)
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    console.log('Loading production index.html from:', indexPath)
    mainWindow.loadFile(indexPath).catch((err: Error) => {
      console.error('Failed to load index.html:', err)
      dialog.showErrorBox('Loading Error', `Failed to load index.html: ${err.message}`)
    })
  }

  // Přidání error handleru pro failed load
  mainWindow.webContents.on('did-fail-load', (_event: Event, errorCode: number, errorDescription: string) => {
    console.error('Failed to load:', errorDescription)
    dialog.showErrorBox('Loading Error', `Failed to load application: ${errorDescription}`)
  })

  // Otevřít DevTools v development módu
  if (!isPackaged) {
    mainWindow.webContents.openDevTools()
  }
}

// Správa životního cyklu aplikace
app.on('window-all-closed', () => {
  mainWindow = null
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

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught exception:', error)
  dialog.showErrorBox('Application Error', `An unexpected error occurred: ${error.message}`)
})

app.whenReady().then(createWindow)
