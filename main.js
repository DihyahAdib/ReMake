//main.js
const { app, BrowserWindow, screen, Menu, ipcMain } = require("electron");
const path = require("path");
const Store = require("electron-store").default;

const store = new Store();

const disableVSync = store.get("disableVSync", false);
if (disableVSync) {
  app.commandLine.appendSwitch("disable-gpu-vsync");
  console.log("VSync disabled via sttored setting.");
} else {
  console.log("VSync enabled via sttored setting.");
}

try {
  require("electron-reloader")(module, {});
} catch (_) {
  console.log(
    "electron-reloader not loaded (likely in production or not installed)"
  );
}
function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  console.log(
    "Preload script path being loaded:",
    path.join(__dirname, "preload.js")
  );
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
      additionalArguments: [
        `--screen-width=${width}`,
        `--screen-height=${height}`,
      ],
    },

    autoHideMenuBar: true,
  });
  Menu.setApplicationMenu(null);
  mainWindow.loadFile("index.html");
  mainWindow.webContents.openDevTools();
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
