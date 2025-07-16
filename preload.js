// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myUniqueElectronAPI", {
  getScreenSize: () => ipcRenderer.invoke("get-screen-size"),
  getSetting: (key) => ipcRenderer.invoke("get-setting", key),
  setSetting: (key, value) => ipcRenderer.invoke("set-setting", key, value),
  toggleFullScreen: (isFullScreen) => ipcRenderer.send("toggle-full-screen", isFullScreen),

  isDevelopment: () => ipcRenderer.invoke("is-development"),

  getScreenWidthSync: () => ipcRenderer.sendSync("get-screen-width"),
  getScreenHeightSync: () => ipcRenderer.sendSync("get-screen-height"),
  screenSize: {
    width: ipcRenderer.sendSync("get-screen-width"),
    height: ipcRenderer.sendSync("get-screen-height"),
  },
});
