// preload.js

const { contextBridge, ipcRenderer } = require("electron");

// Parse the screen dimensions from the command-line arguments
let screenWidth = 1280;
let screenHeight = 720;

contextBridge.exposeInMainWorld("myUniqueElectronAPI", {
  screenSize: {
    width: (() => {
      let width = 800;
      process.argv.forEach((arg) => {
        if (arg.startsWith("--screen-width=")) {
          width = parseInt(arg.split("=")[1], 10);
        }
      });
      return width;
    })(),
    height: (() => {
      let height = 600;
      process.argv.forEach((arg) => {
        if (arg.startsWith("--screen-height=")) {
          height = parseInt(arg.split("=")[1], 10);
        }
      });
      return height;
    })(),
  },
  // --- NEW: Expose methods for settings communication ---
  setSetting: (key, value) => ipcRenderer.invoke("set-setting", key, value),
  getSetting: (key) => ipcRenderer.invoke("get-setting", key),
  // ----------------------------------------------------
});

// Expose these dimensions to the window object in the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  screenSize: {
    width: screenWidth,
    height: screenHeight,
  },
});
