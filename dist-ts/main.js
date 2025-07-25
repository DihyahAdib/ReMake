"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// main.ts
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const electron_store_1 = __importDefault(require("electron-store"));
const store = new electron_store_1.default();
const disableVSync = store.get("disableVSync", false);
if (disableVSync) {
    electron_1.app.commandLine.appendSwitch("disable-gpu-vsync");
    console.log("VSync disabled via stored setting.");
}
else {
    console.log("VSync enabled via stored setting.");
}
const isDevelopment = process.env.NODE_ENV === "development";
try {
    if (isDevelopment) {
        require("electron-reloader")(module, {});
    }
}
catch (e) {
    console.log("electron-reloader not loaded (likely in production or not installed):", e.message);
}
/**
 * Creates the main Electron browser window.
 */
function createWindow() {
    const primaryDisplay = electron_1.screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
    console.log("Preload script path being loaded:", path_1.default.join(__dirname, "preload.js"));
    const mainWindow = new electron_1.BrowserWindow({
        width: store.get("gameWidth", screenWidth),
        height: store.get("gameHeight", screenHeight),
        icon: path_1.default.join(__dirname, "src", "assets/icon.png"),
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: !isDevelopment,
        },
        show: false,
        autoHideMenuBar: true,
    });
    electron_1.Menu.setApplicationMenu(null);
    mainWindow.loadFile(path_1.default.join(__dirname, "src", "index.html"));
    if (isDevelopment) {
        mainWindow.webContents.openDevTools();
    }
    const disableFullScreenOnStart = store.get("disableFullScreen", false);
    mainWindow.setFullScreen(!disableFullScreenOnStart);
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });
}
// When the Electron app is ready, create the window.
electron_1.app.whenReady().then(() => {
    createWindow();
    // IPC Main Handlers for settings.
    // IpcMainInvokeEvent provides type information for the event object.
    electron_1.ipcMain.handle("set-setting", (event, key, value) => {
        store.set(key, value);
        console.log(`Setting '${key}' updated to: ${value}`);
        if (key === "disableVSync") {
            // Relaunch and exit if VSync setting changes, as it often requires a restart.
            electron_1.app.relaunch();
            electron_1.app.exit();
        }
    });
    electron_1.ipcMain.handle("get-setting", (event, key) => {
        // Return type is `unknown` as the stored value's type is not known at compile time.
        // The renderer process will typically cast this to the expected type.
        return store.get(key);
    });
    // IPC Main Listeners for screen dimensions.
    // Electron.IpcMainEvent provides type information for the event object.
    electron_1.ipcMain.on("get-screen-width", (event) => {
        event.returnValue = electron_1.screen.getPrimaryDisplay().workAreaSize.width;
    });
    electron_1.ipcMain.on("get-screen-height", (event) => {
        event.returnValue = electron_1.screen.getPrimaryDisplay().workAreaSize.height;
    });
    electron_1.ipcMain.on("toggle-full-screen", (event, isFullScreen) => {
        const window = electron_1.BrowserWindow.fromWebContents(event.sender);
        if (window) {
            window.setFullScreen(isFullScreen);
            console.log(`Window full screen state set to: ${isFullScreen}`);
        }
    });
    electron_1.ipcMain.handle("is-development", () => {
        return isDevelopment;
    });
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
