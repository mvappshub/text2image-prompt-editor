declare namespace Electron {
  interface IElectronAPI {
    prompt: (message: string) => string | null;
    invoke: (channel: string, ...args: any[]) => Promise<any>;
  }
}

declare global {
  interface Window {
    electron: Electron.IElectronAPI;
    removeLoading: () => void;
  }
}
