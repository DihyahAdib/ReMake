// src/global.d.ts

interface IElectronAPI {
  isDevelopment: () => Promise<boolean>;
  getSetting: (key: string) => Promise<any>; 
  setSetting: (key: string, value: any) => Promise<void>;
  toggleFullScreen: (enable: boolean) => void;
  screenSize: { width: number; height: number };
}

declare global {
  interface Window {
    myUniqueElectronAPI: IElectronAPI;
  }
}

export {};