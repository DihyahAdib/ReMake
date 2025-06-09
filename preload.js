// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myUniqueElectronAPI", {
  screenSize: {
    width: ipcRenderer.sendSync("get-screen-width"),
    height: ipcRenderer.sendSync("get-screen-height"),
  },
  setSetting: (key, value) => ipcRenderer.invoke("set-setting", key, value),
  getSetting: (key) => ipcRenderer.invoke("get-setting", key),
  toggleFullScreen: (isFullScreen) =>
    ipcRenderer.send("toggle-full-screen", isFullScreen),
});
