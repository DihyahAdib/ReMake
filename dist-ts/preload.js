"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// preload.ts
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("myUniqueElectronAPI", {
    getScreenSize: () => electron_1.ipcRenderer.invoke("get-screen-size"),
    getSetting: (key) => electron_1.ipcRenderer.invoke("get-setting", key),
    setSetting: (key, value) => electron_1.ipcRenderer.invoke("set-setting", key, value),
    toggleFullScreen: (isFullScreen) => electron_1.ipcRenderer.send("toggle-full-screen", isFullScreen),
    isDevelopment: () => electron_1.ipcRenderer.invoke("is-development"),
    getScreenWidthSync: () => electron_1.ipcRenderer.sendSync("get-screen-width"),
    getScreenHeightSync: () => electron_1.ipcRenderer.sendSync("get-screen-height"),
    screenSize: {
        width: electron_1.ipcRenderer.sendSync("get-screen-width"),
        height: electron_1.ipcRenderer.sendSync("get-screen-height"),
    },
});
