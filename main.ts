// main.ts
import { app, BrowserWindow, screen, Menu, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "path";
import Store from "electron-store";

const store = new Store();
const disableVSync: boolean = store.get("disableVSync", false) as boolean;

if (disableVSync) {
  app.commandLine.appendSwitch("disable-gpu-vsync");
  console.log("VSync disabled via stored setting.");
} else {
  console.log("VSync enabled via stored setting.");
}

const isDevelopment: boolean = process.env.NODE_ENV === "development";

try {
  if (isDevelopment) {
    require("electron-reloader")(module as any, {});
  }
} catch (e: any) {
  console.log("electron-reloader not loaded (likely in production or not installed):", e.message);
}

function createWindow(): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  console.log("Preload script path being loaded:", path.join(__dirname, "preload.js"));

  const mainWindow = new BrowserWindow({
    width: store.get("gameWidth", screenWidth) as number,
    height: store.get("gameHeight", screenHeight) as number,

    icon: path.join(__dirname, "src", "assets/icon.png"),

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: !isDevelopment,
    },
    show: false,
    autoHideMenuBar: true, 
  });

  Menu.setApplicationMenu(null);
  mainWindow.loadFile(path.join(__dirname, "dist-ts/src", "index.html"));

  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  const disableFullScreenOnStart: boolean = store.get("disableFullScreen", false) as boolean;

  mainWindow.setFullScreen(!disableFullScreenOnStart);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}

// When the Electron app is ready, create the window.
app.whenReady().then(() => {
  createWindow();

  // IPC Main Handlers for settings.
  // IpcMainInvokeEvent provides type information for the event object.
  ipcMain.handle("set-setting", (event: IpcMainInvokeEvent, key: string, value: any) => {
    store.set(key, value);
    console.log(`Setting '${key}' updated to: ${value}`);
    if (key === "disableVSync") {
      // Relaunch and exit if VSync setting changes, as it often requires a restart.
      app.relaunch();
      app.exit();
    }
  });

  ipcMain.handle("get-setting", (event: IpcMainInvokeEvent, key: string): unknown => {
    // Return type is `unknown` as the stored value's type is not known at compile time.
    // The renderer process will typically cast this to the expected type.
    return store.get(key);
  });

  // IPC Main Listeners for screen dimensions.
  // Electron.IpcMainEvent provides type information for the event object.
  ipcMain.on("get-screen-width", (event: Electron.IpcMainEvent) => {
    event.returnValue = screen.getPrimaryDisplay().workAreaSize.width;
  });

  ipcMain.on("get-screen-height", (event: Electron.IpcMainEvent) => {
    event.returnValue = screen.getPrimaryDisplay().workAreaSize.height;
  });

  ipcMain.on("toggle-full-screen", (event: Electron.IpcMainEvent, isFullScreen: boolean) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.setFullScreen(isFullScreen);
      console.log(`Window full screen state set to: ${isFullScreen}`);
    }
  });

  ipcMain.handle("is-development", (): boolean => {
    return isDevelopment;
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});