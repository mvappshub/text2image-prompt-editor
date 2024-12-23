declare namespace Electron {
  interface IElectronAPI {
    prompt: (message: string) => string | null;
  }
}

interface Window {
  electron: Electron.IElectronAPI
}
