export interface IElectronAPI {
  prompt: (message: string) => string | null;
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}
