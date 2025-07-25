// preload.ts
import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface Window {
    myUniqueElectronAPI: {
      getScreenSize: () => Promise<any>;
      getSetting: (key: string) => Promise<unknown>;
      setSetting: (key: string, value: any) => Promise<void>;
      toggleFullScreen: (isFullScreen: boolean) => void;
      isDevelopment: () => Promise<boolean>;
      getScreenWidthSync: () => number;
      getScreenHeightSync: () => number;
      screenSize: {
        width: number;
        height: number;
      };
    };
  }
}

contextBridge.exposeInMainWorld("myUniqueElectronAPI", {
  getScreenSize: () => ipcRenderer.invoke("get-screen-size"),
  getSetting: (key: string) => ipcRenderer.invoke("get-setting", key),
  setSetting: (key: string, value: any) => ipcRenderer.invoke("set-setting", key, value),
  toggleFullScreen: (isFullScreen: boolean) => ipcRenderer.send("toggle-full-screen", isFullScreen),

  isDevelopment: () => ipcRenderer.invoke("is-development"),

  getScreenWidthSync: () => ipcRenderer.sendSync("get-screen-width"),
  getScreenHeightSync: () => ipcRenderer.sendSync("get-screen-height"),
  screenSize: {
    width: ipcRenderer.sendSync("get-screen-width"),
    height: ipcRenderer.sendSync("get-screen-height"),
  },
});
