//main.js
const { app, BrowserWindow, screen, Menu, ipcMain } = require("electron");

const path = require("path");
const Store = require("electron-store");

const store = new Store();

// --- VSync setting application on startup ---
const disableVSync = store.get("disableVSync", false);
if (disableVSync) {
  app.commandLine.appendSwitch("disable-gpu-vsync");
  console.log("VSync disabled via sttored setting.");
} else {
  console.log("VSync enabled via sttored setting.");
}

// Check if electron-reloader is installed and load it only in development
try {
  if (process.env.NODE_ENV === "development") {
    require("electron-reloader")(module, {});
  }
} catch (e) {
  console.log("electron-reloader not loaded (likely in production or not installed):", e.message);
}

const isDevelopment = process.env.NODE_ENV === "development";

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  console.log("Preload script path being loaded:", path.join(__dirname, "preload.js"));

  const mainWindow = new BrowserWindow({
    width: store.get("gameWidth", screenWidth),
    height: store.get("gameWidth", screenHeight),

    icon: path.join(__dirname, "src", "assets/icon.png"),

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: !isDevelopment,
    },
    show: false,
    autoHideMenuBar: true,
  });

  Menu.setApplicationMenu(null);

  mainWindow.loadFile(path.join(__dirname, "src", "index.html"));

  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  const disableFullScreenOnStart = store.get("disableFullScreen", false);
  mainWindow.setFullScreen(!disableFullScreenOnStart);

  // Show window after content is loaded and full screen is set
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("set-setting", (event, key, value) => {
    store.set(key, value);
    console.log(`Setting '${key}' updated to: ${value}`);
    if (key === "disableVSync") {
      app.relaunch();
      app.exit();
    }
  });

  ipcMain.handle("get-setting", (event, key) => {
    return store.get(key);
  });

  // Handler for synchronous screen size requests from preload
  ipcMain.on("get-screen-width", (event) => {
    event.returnValue = screen.getPrimaryDisplay().workAreaSize.width;
  });
  ipcMain.on("get-screen-height", (event) => {
    event.returnValue = screen.getPrimaryDisplay().workAreaSize.height;
  });

  ipcMain.on("toggle-full-screen", (event, isFullScreen) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.setFullScreen(isFullScreen);
      console.log(`Window full screen state set to: ${isFullScreen}`);
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows.length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
//app.commandLine.appendSwitch("disable-frame-rate-limit");
