"use strict";
//settingsScene.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingScene = void 0;
const screenUtils_1 = require("../utils/screenUtils");
const settingsButtonStyle = {
    fontSize: "32px",
    color: "#FFFFFF",
    backgroundColor: "#444",
    padding: { x: 15, y: 10 },
    stroke: "#000000",
    strokeThickness: 2,
};
class SettingScene extends Phaser.Scene {
    constructor() {
        super({ key: "SettingScene" });
        this.previousSceneKey = null;
        this.disableVSync = false;
        this.disableFullScreen = false;
    }
    async create() {
        this.cameras.main.setBackgroundColor("#000");
        this.settingsMnBtnBack = this.add
            .text(40, 40, "Back", settingsButtonStyle)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
            if (this.previousSceneKey === "PauseScene") {
                this.scene.stop("SettingScene");
                this.scene.launch("PauseScene");
            }
            else {
                this.scene.switch("MenuScene");
            }
        });
        // --- VSync Toggle ---
        this.toggleVSyncButton = this.add
            .text(screenUtils_1.winProps.gameWidth / 2, screenUtils_1.winProps.gameHeight / 2, "", settingsButtonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        this.disableVSync = await window.myUniqueElectronAPI.getSetting("disableVSync");
        this.updateVSyncButtonText();
        this.toggleVSyncButton.on("pointerdown", async () => {
            this.disableVSync = !this.disableVSync;
            this.updateVSyncButtonText();
            await window.myUniqueElectronAPI.setSetting("disableVSync", this.disableVSync);
            alert("VSync setting changed. The application will now restart for changes to take effect.");
        });
        // --- FullScreen Toggle ---
        this.toggleFullScreenButton = this.add
            .text(screenUtils_1.winProps.gameWidth / 2, 450, "", settingsButtonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        this.disableFullScreen = await window.myUniqueElectronAPI.getSetting("disableFullScreen");
        this.updateFullScreenButtonText();
        this.toggleFullScreenButton.on("pointerdown", async () => {
            this.disableFullScreen = !this.disableFullScreen;
            this.updateFullScreenButtonText();
            await window.myUniqueElectronAPI.setSetting("disableFullScreen", this.disableFullScreen);
            window.myUniqueElectronAPI.toggleFullScreen(!this.disableFullScreen);
        });
    }
    updateVSyncButtonText() {
        this.toggleVSyncButton.setText(`VSync: ${this.disableVSync ? "Disabled" : "Enabled"}`);
    }
    updateFullScreenButtonText() {
        this.toggleFullScreenButton.setText(`FullScreen: ${this.disableFullScreen ? "Disabled" : "Enabled"}`);
    }
}
exports.SettingScene = SettingScene;
